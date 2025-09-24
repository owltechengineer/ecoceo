'use client';

import { useState, useEffect } from 'react';
import { financialService, FixedCost, VariableCost, Budget, Revenue, Department, CostDistributionWithDepartment } from '@/lib/supabase';
import DatabaseErrorNotification from './DatabaseErrorNotification';

interface FinancialManagementProps {
  onDataChange?: () => void;
}

export default function FinancialManagement({ onDataChange }: FinancialManagementProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'fixed-costs' | 'variable-costs' | 'budgets' | 'revenues' | 'imports' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);
  const [databaseError, setDatabaseError] = useState<Error | null>(null);

  // Dati
  const [departments, setDepartments] = useState<Department[]>([]);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [variableCosts, setVariableCosts] = useState<VariableCost[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [costDistributions, setCostDistributions] = useState<{[key: string]: CostDistributionWithDepartment[]}>({});

  // Impostazioni
  const [customCategories, setCustomCategories] = useState<{[key: string]: string[]}>({});
  const [clients, setClients] = useState<string[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>(['EUR', 'USD', 'GBP']);
  const [defaultCurrency, setDefaultCurrency] = useState('EUR');

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [settingsFormData, setSettingsFormData] = useState<any>({});

  // Statistiche
  const [stats, setStats] = useState({
    totalFixedCosts: 0,
    totalVariableCosts: 0,
    totalBudgets: 0,
    totalRevenues: 0,
    netProfit: 0,
    profitMargin: 0,
    // Nuovi indicatori economici
    annualFixedCosts: 0,
    annualVariableCosts: 0,
    annualTotalCosts: 0,
    annualRevenues: 0,
    annualNetProfit: 0,
    annualProfitMargin: 0,
    costRevenueRatio: 0,
    breakEvenPoint: 0,
    revenueGrowthRate: 0,
    costGrowthRate: 0,
    efficiencyRatio: 0,
    monthlyFixedCosts: 0,
    monthlyVariableCosts: 0,
    monthlyTotalCosts: 0,
    monthlyRevenues: 0,
    monthlyNetProfit: 0,
    monthlyBreakEven: 0,
    daysToBreakEven: 0,
    // Informazioni proiezioni
    revenueIsProjected: false,
    revenueMonthsData: 0
  });

  const categories = {
    fixedCosts: ['office', 'software', 'marketing', 'personnel', 'utilities', 'insurance', 'legal', 'other'],
    variableCosts: ['materials', 'services', 'travel', 'equipment', 'training', 'consulting', 'other'],
    revenues: ['sales', 'services', 'consulting', 'subscriptions', 'investments', 'grants', 'other'],
    frequencies: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    paymentStatuses: ['pending', 'paid', 'overdue', 'cancelled'],
    budgetTypes: ['project', 'marketing', 'general', 'department']
  };

  useEffect(() => {
    loadData();
    loadSettings();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setDatabaseError(null);
    try {
      const [departmentsData, fixedCostsData, variableCostsData, budgetsData, revenuesData] = await Promise.all([
        financialService.loadDepartments(),
        financialService.loadFixedCosts(),
        financialService.loadVariableCosts(),
        financialService.loadBudgets(),
        financialService.loadRevenues()
      ]);

      setDepartments(departmentsData);
      setFixedCosts(fixedCostsData);
      setVariableCosts(variableCostsData);
      setBudgets(budgetsData);
      setRevenues(revenuesData);

      // Carica distribuzioni per costi fissi
      const fixedDistributions: {[key: string]: CostDistributionWithDepartment[]} = {};
      for (const cost of fixedCostsData) {
        try {
          const distributions = await financialService.getCostDistribution(cost.id, 'fixed');
          fixedDistributions[cost.id] = distributions;
        } catch (error) {
          console.error(`Errore caricamento distribuzione costo fisso ${cost.id}:`, error);
          fixedDistributions[cost.id] = [];
        }
      }

      // Carica distribuzioni per costi variabili
      const variableDistributions: {[key: string]: CostDistributionWithDepartment[]} = {};
      for (const cost of variableCostsData) {
        try {
          const distributions = await financialService.getCostDistribution(cost.id, 'variable');
          variableDistributions[cost.id] = distributions;
        } catch (error) {
          console.error(`Errore caricamento distribuzione costo variabile ${cost.id}:`, error);
          variableDistributions[cost.id] = [];
        }
      }

      setCostDistributions({...fixedDistributions, ...variableDistributions});

      // Calcola statistiche mensili
      const totalFixedCosts = fixedCostsData.reduce((sum, cost) => sum + cost.amount, 0);
      const totalVariableCosts = variableCostsData.reduce((sum, cost) => sum + cost.amount, 0);
      const totalBudgets = budgetsData.reduce((sum, budget) => sum + budget.amount, 0);
      const totalRevenues = revenuesData.reduce((sum, revenue) => sum + revenue.amount, 0);
      const netProfit = totalRevenues - totalFixedCosts - totalVariableCosts;
      const profitMargin = totalRevenues > 0 ? (netProfit / totalRevenues) * 100 : 0;

      // Calcola indicatori economici annuali
      const annualFixedCosts = calculateAnnualCosts(fixedCostsData);
      const annualVariableCosts = calculateAnnualVariableCosts(variableCostsData);
      const annualTotalCosts = annualFixedCosts + annualVariableCosts;
      const revenueCalc = calculateAnnualRevenues(revenuesData);
      const annualRevenues = revenueCalc.value;
      const annualNetProfit = annualRevenues - annualTotalCosts;
      const annualProfitMargin = annualRevenues > 0 ? (annualNetProfit / annualRevenues) * 100 : 0;

      // Calcola totali mensili
      const monthlyCosts = calculateMonthlyCosts(fixedCostsData, variableCostsData);
      const monthlyRevenues = calculateMonthlyRevenues(revenuesData);
      const monthlyNetProfit = monthlyRevenues - monthlyCosts.monthlyTotalCosts;
      const breakEvenData = calculateBreakEven(monthlyCosts.monthlyFixedCosts, monthlyRevenues, monthlyCosts.monthlyVariableCosts);

      // Calcola indicatori economici avanzati
      const costRevenueRatio = annualRevenues > 0 ? (annualTotalCosts / annualRevenues) * 100 : 0;
      const breakEvenPoint = annualFixedCosts; // Punto di pareggio = costi fissi
      const efficiencyRatio = annualRevenues > 0 ? (annualNetProfit / annualTotalCosts) * 100 : 0;

      // Simula tassi di crescita (in un'app reale questi verrebbero da dati storici)
      const revenueGrowthRate = Math.random() * 20 - 10; // -10% a +10%
      const costGrowthRate = Math.random() * 15 - 5; // -5% a +10%

      setStats({
        totalFixedCosts,
        totalVariableCosts,
        totalBudgets,
        totalRevenues,
        netProfit,
        profitMargin,
        annualFixedCosts,
        annualVariableCosts,
        annualTotalCosts,
        annualRevenues,
        annualNetProfit,
        annualProfitMargin,
        costRevenueRatio,
        // Informazioni proiezione
        revenueIsProjected: revenueCalc.isProjected,
        revenueMonthsData: revenueCalc.monthsData,
        breakEvenPoint,
        revenueGrowthRate,
        costGrowthRate,
        efficiencyRatio,
        monthlyFixedCosts: monthlyCosts.monthlyFixedCosts,
        monthlyVariableCosts: monthlyCosts.monthlyVariableCosts,
        monthlyTotalCosts: monthlyCosts.monthlyTotalCosts,
        monthlyRevenues,
        monthlyNetProfit,
        monthlyBreakEven: breakEvenData.monthlyBreakEven,
        daysToBreakEven: breakEvenData.daysToBreakEven
      });

      console.log('✅ Dati finanziari caricati con successo');
    } catch (error) {
      console.error('Errore caricamento dati finanziari:', JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        setDatabaseError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImportProjectCosts = async () => {
    setLoading(true);
    try {
      await financialService.importProjectCosts();
      await loadData();
      alert('✅ Costi progetti importati con successo!');
    } catch (error) {
      console.error('Errore importazione costi progetti:', error);
      alert('❌ Errore nell\'importazione dei costi progetti');
    } finally {
      setLoading(false);
    }
  };

  const handleImportMarketingCosts = async () => {
    setLoading(true);
    try {
      await financialService.importMarketingCosts();
      await loadData();
      alert('✅ Costi marketing importati con successo!');
    } catch (error) {
      console.error('Errore importazione costi marketing:', error);
      alert('❌ Errore nell\'importazione dei costi marketing');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecurringCosts = async () => {
    setLoading(true);
    try {
      await financialService.generateRecurringCosts();
      await loadData();
      alert('✅ Costi ricorrenti generati automaticamente!');
    } catch (error) {
      console.error('Errore generazione costi ricorrenti:', error);
      alert('❌ Errore nella generazione dei costi ricorrenti');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.amount) {
      alert('❌ Nome e importo sono obbligatori');
      return;
    }

    setLoading(true);
    try {
      let savedItem;
      switch (activeTab) {
        case 'fixed-costs':
          savedItem = editingItem 
            ? await financialService.updateFixedCost(editingItem.id, formData)
            : await financialService.saveFixedCost(formData);
          break;
        case 'variable-costs':
          savedItem = editingItem 
            ? await financialService.updateVariableCost(editingItem.id, formData)
            : await financialService.saveVariableCost(formData);
          break;
        case 'budgets':
          savedItem = editingItem 
            ? await financialService.updateBudget(editingItem.id, formData)
            : await financialService.saveBudget(formData);
          break;
        case 'revenues':
          savedItem = editingItem 
            ? await financialService.updateRevenue(editingItem.id, formData)
            : await financialService.saveRevenue(formData);
          break;
      }

      await loadData();
      resetForm();
      alert('✅ Dati salvati con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio dei dati');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;

    setLoading(true);
    try {
      switch (type) {
        case 'fixed-cost':
          await financialService.deleteFixedCost(id);
          break;
        case 'variable-cost':
          await financialService.deleteVariableCost(id);
          break;
        case 'budget':
          await financialService.deleteBudget(id);
          break;
        case 'revenue':
          await financialService.deleteRevenue(id);
          break;
      }

      await loadData();
      alert('✅ Elemento eliminato con successo!');
      } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore nell\'eliminazione dell\'elemento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calcola costi annuali basati sulla frequenza
  const calculateAnnualCosts = (costs: FixedCost[]) => {
    return costs.reduce((total, cost) => {
      if (!cost.is_active) return total;
      
      let annualAmount = cost.amount;
      switch (cost.frequency) {
        case 'daily':
          annualAmount *= 365;
          break;
        case 'weekly':
          annualAmount *= 52;
          break;
        case 'monthly':
          annualAmount *= 12;
          break;
        case 'quarterly':
          annualAmount *= 4;
          break;
        case 'yearly':
          annualAmount *= 1;
          break;
      }
      return total + annualAmount;
    }, 0);
  };

  // Calcola ricavi annuali con proiezione intelligente
  const calculateAnnualRevenues = (revenues: Revenue[]) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentDay = new Date().getDate();
    const today = new Date();
    
    // Ricavi dell'anno corrente
    const currentYearRevenues = revenues
      .filter(revenue => new Date(revenue.date).getFullYear() === currentYear)
      .reduce((total, revenue) => total + revenue.amount, 0);
    
    // Se siamo ancora all'inizio dell'anno, facciamo una proiezione
    if (currentMonth <= 6) { // Prima metà dell'anno
      const monthsElapsed = currentMonth - 1 + (currentDay / 30); // Mesi decimali trascorsi
      
      if (monthsElapsed > 0 && currentYearRevenues > 0) {
        // Proiezione basata sui dati attuali
        const monthlyAverage = currentYearRevenues / monthsElapsed;
        const projectedAnnual = monthlyAverage * 12;
        
        console.log(`📊 Proiezione ricavi annuali: ${monthsElapsed.toFixed(1)} mesi, media mensile: €${monthlyAverage.toFixed(0)}, proiezione: €${projectedAnnual.toFixed(0)}`);
        return { value: projectedAnnual, isProjected: true, monthsData: monthsElapsed };
      }
    }
    
    // Se siamo nella seconda metà dell'anno, usiamo i dati reali
    console.log(`📊 Ricavi annuali reali: €${currentYearRevenues.toFixed(0)}`);
    return { value: currentYearRevenues, isProjected: false, monthsData: currentMonth };
  };

  // Calcola costi variabili annuali con proiezione intelligente
  const calculateAnnualVariableCosts = (variableCosts: VariableCost[]) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentDay = new Date().getDate();
    
    // Costi variabili dell'anno corrente
    const currentYearCosts = variableCosts
      .filter(cost => new Date(cost.date).getFullYear() === currentYear)
      .reduce((total, cost) => total + cost.amount, 0);
    
    // Se siamo ancora all'inizio dell'anno, facciamo una proiezione
    if (currentMonth <= 6) { // Prima metà dell'anno
      const monthsElapsed = currentMonth - 1 + (currentDay / 30); // Mesi decimali trascorsi
      
      if (monthsElapsed > 0 && currentYearCosts > 0) {
        // Proiezione basata sui dati attuali
        const monthlyAverage = currentYearCosts / monthsElapsed;
        const projectedAnnual = monthlyAverage * 12;
        
        console.log(`📊 Proiezione costi variabili annuali: ${monthsElapsed.toFixed(1)} mesi, media mensile: €${monthlyAverage.toFixed(0)}, proiezione: €${projectedAnnual.toFixed(0)}`);
        return projectedAnnual;
      }
    }
    
    // Se siamo nella seconda metà dell'anno, usiamo i dati reali
    console.log(`📊 Costi variabili annuali reali: €${currentYearCosts.toFixed(0)}`);
    return currentYearCosts;
  };

  // Calcola tasso di crescita (confronto con anno precedente)
  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Calcola totali mensili
  const calculateMonthlyCosts = (fixedCosts: FixedCost[], variableCosts: VariableCost[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Costi fissi mensili (considerando frequenza)
    const monthlyFixedCosts = fixedCosts.reduce((sum, cost) => {
      if (!cost.is_active) return sum;
      
      let monthlyAmount = cost.amount;
      switch (cost.frequency) {
        case 'daily': monthlyAmount = cost.amount * 30; break;
        case 'weekly': monthlyAmount = cost.amount * 4.33; break;
        case 'monthly': monthlyAmount = cost.amount; break;
        case 'quarterly': monthlyAmount = cost.amount / 3; break;
        case 'yearly': monthlyAmount = cost.amount / 12; break;
        default: monthlyAmount = cost.amount;
      }
      return sum + monthlyAmount;
    }, 0);

    // Costi variabili del mese corrente
    const monthlyVariableCosts = variableCosts.reduce((sum, cost) => {
      const costDate = new Date(cost.date);
      if (costDate.getMonth() === currentMonth && costDate.getFullYear() === currentYear) {
        return sum + cost.amount;
      }
      return sum;
    }, 0);

    return {
      monthlyFixedCosts,
      monthlyVariableCosts,
      monthlyTotalCosts: monthlyFixedCosts + monthlyVariableCosts
    };
  };

  const calculateMonthlyRevenues = (revenues: Revenue[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return revenues.reduce((sum, revenue) => {
      const revenueDate = new Date(revenue.date);
      if (revenueDate.getMonth() === currentMonth && revenueDate.getFullYear() === currentYear) {
        return sum + revenue.amount;
      }
      return sum;
    }, 0);
  };

  const calculateBreakEven = (monthlyFixedCosts: number, monthlyRevenues: number, monthlyVariableCosts: number) => {
    // Break-even mensile = Costi fissi mensili
    const monthlyBreakEven = monthlyFixedCosts;
    
    // Giorni per raggiungere il break-even nel mese corrente
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const remainingDays = daysInMonth - currentDay;
    
    // Calcola il tasso giornaliero necessario per raggiungere il break-even
    const dailyRevenueNeeded = monthlyBreakEven / daysInMonth;
    const dailyRevenueCurrent = monthlyRevenues / currentDay;
    
    let daysToBreakEven = 0;
    if (dailyRevenueCurrent > dailyRevenueNeeded) {
      daysToBreakEven = Math.ceil(monthlyBreakEven / dailyRevenueCurrent);
    } else {
      daysToBreakEven = remainingDays + Math.ceil((monthlyBreakEven - monthlyRevenues) / dailyRevenueNeeded);
    }
    
    return { monthlyBreakEven, daysToBreakEven };
  };

  // Funzioni per gestire le impostazioni
  const loadSettings = () => {
    // Carica impostazioni da localStorage o database
    const savedCategories = localStorage.getItem('financial-categories');
    const savedClients = localStorage.getItem('financial-clients');
    const savedVendors = localStorage.getItem('financial-vendors');
    const savedPaymentMethods = localStorage.getItem('financial-payment-methods');
    const savedCurrencies = localStorage.getItem('financial-currencies');
    const savedDefaultCurrency = localStorage.getItem('financial-default-currency');

    if (savedCategories) setCustomCategories(JSON.parse(savedCategories));
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedVendors) setVendors(JSON.parse(savedVendors));
    if (savedPaymentMethods) setPaymentMethods(JSON.parse(savedPaymentMethods));
    if (savedCurrencies) setCurrencies(JSON.parse(savedCurrencies));
    if (savedDefaultCurrency) setDefaultCurrency(savedDefaultCurrency);
  };

  const saveSettings = () => {
    localStorage.setItem('financial-categories', JSON.stringify(customCategories));
    localStorage.setItem('financial-clients', JSON.stringify(clients));
    localStorage.setItem('financial-vendors', JSON.stringify(vendors));
    localStorage.setItem('financial-payment-methods', JSON.stringify(paymentMethods));
    localStorage.setItem('financial-currencies', JSON.stringify(currencies));
    localStorage.setItem('financial-default-currency', defaultCurrency);
    alert('✅ Impostazioni salvate con successo!');
  };

  const addCategory = (type: string, category: string) => {
    if (!category.trim()) return;
    setCustomCategories(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), category.trim()]
    }));
  };

  const removeCategory = (type: string, category: string) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: (prev[type] || []).filter(c => c !== category)
    }));
  };

  const addClient = (client: string) => {
    if (!client.trim() || clients.includes(client.trim())) return;
    setClients(prev => [...prev, client.trim()]);
  };

  const removeClient = (client: string) => {
    setClients(prev => prev.filter(c => c !== client));
  };

  const addVendor = (vendor: string) => {
    if (!vendor.trim() || vendors.includes(vendor.trim())) return;
    setVendors(prev => [...prev, vendor.trim()]);
  };

  const removeVendor = (vendor: string) => {
    setVendors(prev => prev.filter(v => v !== vendor));
  };

  const addPaymentMethod = (method: string) => {
    if (!method.trim() || paymentMethods.includes(method.trim())) return;
    setPaymentMethods(prev => [...prev, method.trim()]);
  };

  const removePaymentMethod = (method: string) => {
    setPaymentMethods(prev => prev.filter(m => m !== method));
  };

  const addCurrency = (currency: string) => {
    if (!currency.trim() || currencies.includes(currency.trim())) return;
    setCurrencies(prev => [...prev, currency.trim()]);
  };

  const removeCurrency = (currency: string) => {
    setCurrencies(prev => prev.filter(c => c !== currency));
  };

  const renderCostDistribution = (costId: string, costType: 'fixed' | 'variable') => {
    const distributions = costDistributions[costId] || [];
    if (distributions.length === 0) {
  return (
        <div className="text-sm text-gray-700 font-semibold italic">
          Nessuna distribuzione settori
          </div>
      );
    }

  return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Distribuzione per Settori:</div>
        {distributions.map((dist, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dist.department_color }}
              ></div>
              <span className="text-gray-600">{dist.department_name}</span>
        </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">{formatCurrency(dist.amount)}</div>
              <div className="text-xs text-gray-700 font-semibold">{dist.percentage}%</div>
      </div>
        </div>
        ))}
        </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'received': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (databaseError) {
    return <DatabaseErrorNotification error={databaseError} onDismiss={() => setDatabaseError(null)} />;
  }

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">💰 Gestione Finanziaria</h1>
            <p className="text-gray-600 mt-1">Gestisci costi, budget e analisi finanziaria</p>
        </div>
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateRecurringCosts}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              🔄 Genera Costi Ricorrenti
            </button>
            <button
              onClick={handleImportProjectCosts}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              📥 Importa Costi Progetti
            </button>
            <button
              onClick={handleImportMarketingCosts}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              📥 Importa Costi Marketing
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-gray-800 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-gray-700"
            >
              ➕ Nuovo
            </button>
          </div>
        </div>
      </div>

      {/* Statistiche Overview */}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'fixed-costs', label: '💸 Costi Fissi', icon: '💸' },
              { id: 'variable-costs', label: '📈 Costi Variabili', icon: '📈' },
              { id: 'budgets', label: '💰 Budget', icon: '💰' },
              { id: 'revenues', label: '💵 Entrate', icon: '💵' },
              { id: 'imports', label: '📥 Importazioni', icon: '📥' },
              { id: 'settings', label: '⚙️ Impostazioni', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-700 font-semibold hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Contenuto delle tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Panoramica Finanziaria Annuale</h3>
              
              {/* Indicatori economici principali */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <span className="text-2xl">💸</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Costi Totali Annui</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.annualTotalCosts)}</p>
                      <p className="text-xs opacity-75">
                        Fissi: {formatCurrency(stats.annualFixedCosts)} | 
                        Variabili: {formatCurrency(stats.annualVariableCosts)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <span className="text-2xl">💵</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Ricavi Totali Annui</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.annualRevenues)}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs opacity-75">
                          Crescita: {formatPercentage(stats.revenueGrowthRate)}
                        </p>
                        {stats.revenueIsProjected && (
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                            📈 Proiezione ({stats.revenueMonthsData?.toFixed(1)}m)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 text-white ${stats.annualNetProfit >= 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Profitto Netto Annuo</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.annualNetProfit)}</p>
                      <p className="text-xs opacity-75">Margine: {formatPercentage(stats.annualProfitMargin)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Efficienza</p>
                      <p className="text-2xl font-bold">{formatPercentage(stats.efficiencyRatio)}</p>
                      <p className="text-xs opacity-75">ROI sui costi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicatori avanzati */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">📈 Rapporto Costi/Ricavi</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rapporto:</span>
                      <span className="font-medium text-gray-900">{stats.costRevenueRatio.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stats.costRevenueRatio < 0.8 ? 'bg-green-500' : stats.costRevenueRatio < 1.0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(stats.costRevenueRatio * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-700 font-semibold">
                      {stats.costRevenueRatio < 0.8 ? '✅ Ottimo controllo costi' : 
                       stats.costRevenueRatio < 1.0 ? '⚠️ Attenzione ai costi' : '❌ Costi troppo alti'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">🎯 Break-Even Point</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Punto di pareggio:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(stats.breakEvenPoint)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stats.annualRevenues >= stats.breakEvenPoint ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((stats.annualRevenues / Math.max(stats.breakEvenPoint, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-700 font-semibold">
                      {stats.annualRevenues >= stats.breakEvenPoint ? '✅ Sopra il break-even' : '❌ Sotto il break-even'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">📊 Crescita Annuale</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ricavi:</span>
                      <span className={`font-medium ${stats.revenueGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(stats.revenueGrowthRate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Costi:</span>
                      <span className={`font-medium ${stats.costGrowthRate <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(stats.costGrowthRate)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-semibold">
                      {stats.revenueGrowthRate > stats.costGrowthRate ? '✅ Crescita positiva' : '⚠️ Controllare costi'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grafico a barre per distribuzione annuale */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Distribuzione Annuale Costi vs Ricavi</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Costi Fissi Annui</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-40 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full" 
                          style={{ width: `${Math.min((stats.annualFixedCosts / Math.max(stats.annualRevenues, 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.annualFixedCosts)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Costi Variabili Annui</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-40 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-orange-500 h-3 rounded-full" 
                          style={{ width: `${Math.min((stats.annualVariableCosts / Math.max(stats.annualRevenues, 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.annualVariableCosts)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Ricavi Totali Annui</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-40 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.annualRevenues)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riepilogo finale */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Situazione Economica {new Date().getFullYear()}</p>
                      <p className={`text-2xl font-bold ${stats.annualNetProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stats.annualNetProfit >= 0 ? '✅ Positiva' : '❌ Negativa'}
                      </p>
                      <p className="text-xs opacity-75">
                        Profitto: {formatCurrency(stats.annualNetProfit)} | 
                        Margine: {formatPercentage(stats.annualProfitMargin)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-75">Ultimo aggiornamento</p>
                    <p className="text-sm font-medium">{new Date().toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fixed-costs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Costi Fissi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixedCosts.map((cost) => (
                  <div key={cost.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{cost.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cost.is_active ? 'active' : 'cancelled')}`}>
                        {cost.is_active ? 'Attivo' : 'Inattivo'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2 font-medium">{cost.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Importo:</span>
                        <span className="font-bold text-red-600">{formatCurrency(cost.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Frequenza:</span>
                        <span className="font-bold text-gray-900">{cost.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Categoria:</span>
                        <span className="font-bold text-gray-900">{cost.category}</span>
                </div>
              </div>
              
                    {/* Distribuzione per settori */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {renderCostDistribution(cost.id, 'fixed')}
                    </div>
                    <div className="flex space-x-2 mt-3">
                  <button 
                        onClick={() => handleEdit(cost)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                            Modifica
                  </button>
                          <button 
                        onClick={() => handleDelete(cost.id, 'fixed-cost')}
                        className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Elimina
                          </button>
                </div>
              </div>
                    ))}
              </div>
            </div>
          )}

          {activeTab === 'variable-costs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Costi Variabili</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variableCosts.map((cost) => (
                  <div key={cost.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{cost.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cost.is_paid ? 'paid' : 'pending')}`}>
                        {cost.is_paid ? 'Pagato' : 'In sospeso'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{cost.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Importo:</span>
                        <span className="font-medium text-red-600">{formatCurrency(cost.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Categoria:</span>
                        <span className="font-bold text-gray-900">{cost.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Data:</span>
                        <span className="font-bold text-gray-900">{new Date(cost.date).toLocaleDateString('it-IT')}</span>
                      </div>
                      {cost.vendor && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-semibold">Fornitore:</span>
                          <span className="font-bold text-gray-900">{cost.vendor}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Distribuzione per settori */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {renderCostDistribution(cost.id, 'variable')}
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                          <button
                        onClick={() => handleEdit(cost)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Modifica
                          </button>
                          <button 
                        onClick={() => handleDelete(cost.id, 'variable-cost')}
                        className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Elimina
                          </button>
              </div>
                  </div>
                    ))}
              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {budgets.map((budget) => (
                  <div key={budget.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{budget.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(budget.is_active ? 'active' : 'cancelled')}`}>
                        {budget.is_active ? 'Attivo' : 'Inattivo'}
                          </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{budget.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Budget Totale:</span>
                        <span className="font-medium text-green-600">{formatCurrency(budget.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Speso:</span>
                        <span className="font-medium text-red-600">€0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Rimanente:</span>
                        <span className="font-medium text-blue-600">{formatCurrency(budget.amount)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                <button 
                        onClick={() => handleEdit(budget)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Modifica
                          </button>
                          <button 
                        onClick={() => handleDelete(budget.id, 'budget')}
                        className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Elimina
                </button>
              </div>
                  </div>
                    ))}
              </div>
            </div>
          )}

          {activeTab === 'revenues' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Entrate</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {revenues.map((revenue) => (
                  <div key={revenue.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{revenue.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(revenue.is_received ? 'received' : 'pending')}`}>
                        {revenue.is_received ? 'Ricevuto' : 'In sospeso'}
                          </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{revenue.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Importo:</span>
                        <span className="font-medium text-green-600">{formatCurrency(revenue.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Categoria:</span>
                        <span className="font-bold text-gray-900">{revenue.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">Data:</span>
                        <span className="font-bold text-gray-900">{new Date(revenue.date).toLocaleDateString('it-IT')}</span>
                      </div>
                      {revenue.client && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-semibold">Cliente:</span>
                          <span className="font-bold text-gray-900">{revenue.client}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-3">
                          <button
                        onClick={() => handleEdit(revenue)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Modifica
                          </button>
                          <button 
                        onClick={() => handleDelete(revenue.id, 'revenue')}
                        className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Elimina
                          </button>
              </div>
                  </div>
                    ))}
              </div>
            </div>
          )}

          {activeTab === 'imports' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Importazioni</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Importa Dati da Altre Sezioni</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h5 className="font-medium text-gray-900">Costi Progetti</h5>
                      <p className="text-sm text-gray-600">Importa budget dai progetti esistenti</p>
                    </div>
                <button 
                      onClick={handleImportProjectCosts}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                      Importa
                </button>
              </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h5 className="font-medium text-gray-900">Costi Marketing</h5>
                      <p className="text-sm text-gray-600">Importa budget dalle campagne marketing</p>
                    </div>
                          <button
                      onClick={handleImportMarketingCosts}
                      disabled={loading}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                          >
                      Importa
                          </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">⚙️ Impostazioni Sistema</h3>
                <button 
                  onClick={saveSettings}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  💾 Salva Impostazioni
                </button>
              </div>
              
              {/* Categorie Personalizzate */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">📂 Categorie Costi Fissi</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nuova categoria"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCategory('fixedCosts', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                          <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addCategory('fixedCosts', input.value);
                          input.value = '';
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md"
                      >
                        +
                          </button>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {[...categories.fixedCosts, ...(customCategories.fixedCosts || [])].map((cat, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 shadow-sm">
                          <span>{cat}</span>
                          {customCategories.fixedCosts?.includes(cat) && (
                          <button 
                              onClick={() => removeCategory('fixedCosts', cat)}
                              className="text-red-600 hover:text-red-800 font-bold text-lg px-2 py-1 rounded-full hover:bg-red-100"
                          >
                              ×
                          </button>
                          )}
                        </div>
                    ))}
              </div>
            </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">📈 Categorie Costi Variabili</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nuova categoria"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCategory('variableCosts', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addCategory('variableCosts', input.value);
                          input.value = '';
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md"
                      >
                        +
                      </button>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {[...categories.variableCosts, ...(customCategories.variableCosts || [])].map((cat, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 shadow-sm">
                          <span>{cat}</span>
                          {customCategories.variableCosts?.includes(cat) && (
                            <button
                              onClick={() => removeCategory('variableCosts', cat)}
                              className="text-red-600 hover:text-red-800 font-bold text-lg px-2 py-1 rounded-full hover:bg-red-100"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
        </div>
      </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">💵 Categorie Entrate</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nuova categoria"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCategory('revenues', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addCategory('revenues', input.value);
                          input.value = '';
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md"
                      >
                        +
                      </button>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {[...categories.revenues, ...(customCategories.revenues || [])].map((cat, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 shadow-sm">
                          <span>{cat}</span>
                          {customCategories.revenues?.includes(cat) && (
                            <button
                              onClick={() => removeCategory('revenues', cat)}
                              className="text-red-600 hover:text-red-800 font-bold text-lg px-2 py-1 rounded-full hover:bg-red-100"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clienti e Fornitori */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">👥 Clienti</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
              type="text"
                        placeholder="Nome cliente"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addClient(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addClient(input.value);
                          input.value = '';
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 shadow-md"
                      >
                        +
                      </button>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {clients.map((client, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 shadow-sm">
                          <span>{client}</span>
                          <button
                            onClick={() => removeClient(client)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">🏢 Fornitori</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nome fornitore"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addVendor(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addVendor(input.value);
                          input.value = '';
                        }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 shadow-md"
                      >
                        +
                      </button>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {vendors.map((vendor, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 shadow-sm">
                          <span>{vendor}</span>
                          <button
                            onClick={() => removeVendor(vendor)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metodi di Pagamento e Valute */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">💳 Metodi di Pagamento</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nuovo metodo"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addPaymentMethod(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addPaymentMethod(input.value);
                          input.value = '';
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-md"
                      >
                        +
                      </button>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {paymentMethods.map((method, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 shadow-sm">
                          <span>{method}</span>
                          <button
                            onClick={() => removePaymentMethod(method)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">💰 Valute</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Codice valuta (es. USD)"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCurrency(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addCurrency(input.value);
                          input.value = '';
                        }}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 shadow-md"
                      >
                        +
                      </button>
          </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {currencies.map((currency, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 shadow-sm">
                          <span>{currency}</span>
                          <div className="flex items-center space-x-2">
                            {currency === defaultCurrency && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                            )}
                            <button
                              onClick={() => removeCurrency(currency)}
                              className="text-red-600 hover:text-red-800 font-bold text-lg px-2 py-1 rounded-full hover:bg-red-100"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2">
                      <label className="block text-sm font-bold text-gray-800 mb-1">Valuta Predefinita</label>
                      <select
                        value={defaultCurrency}
                        onChange={(e) => setDefaultCurrency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {currencies.map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impostazioni Generali */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-lg text-gray-900 mb-4">🔧 Impostazioni Generali</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Formato Data</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Formato Numeri</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="it-IT">Italiano (1.234,56)</option>
                      <option value="en-US">Americano (1,234.56)</option>
                      <option value="de-DE">Tedesco (1.234,56)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Modifica' : 'Nuovo'} {
                activeTab === 'fixed-costs' ? 'Costo Fisso' : 
                activeTab === 'variable-costs' ? 'Costo Variabile' :
                activeTab === 'budgets' ? 'Budget' : 'Entrata'
              }
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Nome *</label>
                <input
              type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Nome del costo/entrata"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Descrizione</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Descrizione"
                  rows={3}
            />
          </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Importo *</label>
                  <input
              type="number"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
            />
          </div>

              {/* Campi specifici per Costi Fissi */}
              {activeTab === 'fixed-costs' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Frequenza</label>
                    <select
                      value={formData.frequency || 'monthly'}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {categories.frequencies.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Categoria</label>
                    <select
                      value={formData.category || 'office'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {categories.fixedCosts.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Data Inizio</label>
                    <input
                      type="date"
                      value={formData.start_date || ''}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Data Fine (opzionale)</label>
                    <input
                      type="date"
                      value={formData.end_date || ''}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Giorno di Pagamento</label>
                    <input
              type="number"
                      min="1"
                      max="31"
                      value={formData.payment_day || ''}
                      onChange={(e) => setFormData({...formData, payment_day: parseInt(e.target.value) || 1})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="1-31"
            />
          </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-800">
                      Attivo
                    </label>
          </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto_generate"
                      checked={formData.auto_generate !== false}
                      onChange={(e) => setFormData({...formData, auto_generate: e.target.checked})}
                      className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="auto_generate" className="text-sm font-medium text-gray-800">
                      Genera automaticamente costi ricorrenti
                    </label>
                  </div>
                </>
              )}

              {/* Campi specifici per Costi Variabili */}
              {activeTab === 'variable-costs' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Categoria</label>
                    <select
                      value={formData.category || 'materials'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {categories.variableCosts.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Data Incurred</label>
                    <input
                      type="date"
                      value={formData.date_incurred || ''}
                      onChange={(e) => setFormData({...formData, date_incurred: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Fornitore</label>
                    <input
              type="text"
                      value={formData.vendor || ''}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="Nome fornitore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Numero Fattura</label>
                    <input
                      type="text"
                      value={formData.invoice_number || ''}
                      onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="Numero fattura"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Stato Pagamento</label>
                    <select
                      value={formData.payment_status || 'pending'}
                      onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="pending">In Attesa</option>
                      <option value="paid">Pagato</option>
                      <option value="overdue">Scaduto</option>
                      <option value="cancelled">Annullato</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_recurring"
                      checked={formData.is_recurring || false}
                      onChange={(e) => setFormData({...formData, is_recurring: e.target.checked})}
                      className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_recurring" className="text-sm font-medium text-gray-800">
                      Costo Ricorrente
                    </label>
                  </div>
                  {formData.is_recurring && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Pattern Ricorrente</label>
                        <select
                          value={formData.recurring_pattern || 'monthly'}
                          onChange={(e) => setFormData({...formData, recurring_pattern: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                          <option value="daily">Giornaliero</option>
                          <option value="weekly">Settimanale</option>
                          <option value="monthly">Mensile</option>
                          <option value="quarterly">Trimestrale</option>
                          <option value="yearly">Annuale</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Ricorrente Fino A</label>
                        <input
                          type="date"
                          value={formData.recurring_until || ''}
                          onChange={(e) => setFormData({...formData, recurring_until: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Campi specifici per Budget */}
              {activeTab === 'budgets' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Budget Totale</label>
                    <input
              type="number"
                      step="0.01"
                      value={formData.total_amount || ''}
                      onChange={(e) => setFormData({...formData, total_amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Importo Speso</label>
                    <input
              type="number"
                      step="0.01"
                      value={formData.spent_amount || ''}
                      onChange={(e) => setFormData({...formData, spent_amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Periodo Inizio</label>
                    <input
                      type="date"
                      value={formData.start_date || ''}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Periodo Fine</label>
                    <input
                      type="date"
                      value={formData.end_date || ''}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Stato</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="active">Attivo</option>
                      <option value="completed">Completato</option>
                      <option value="cancelled">Annullato</option>
                    </select>
                  </div>
                </>
              )}

              {/* Campi specifici per Entrate */}
              {activeTab === 'revenues' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Categoria</label>
                    <select
                      value={formData.category || 'sales'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {categories.revenues.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Data Ricevimento</label>
                    <input
                      type="date"
                      value={formData.date_received || ''}
                      onChange={(e) => setFormData({...formData, date_received: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Nome Cliente</label>
                    <input
                      type="text"
                      value={formData.client_name || ''}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="Nome cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Numero Fattura</label>
                    <input
                      type="text"
                      value={formData.invoice_number || ''}
                      onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="Numero fattura"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Metodo Pagamento</label>
                    <select
                      value={formData.payment_method || 'bank_transfer'}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="cash">Contanti</option>
                      <option value="bank_transfer">Bonifico</option>
                      <option value="credit_card">Carta di Credito</option>
                      <option value="check">Assegno</option>
                      <option value="crypto">Criptovaluta</option>
                      <option value="other">Altro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Stato</label>
                    <select
                      value={formData.status || 'pending'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="pending">In Attesa</option>
                      <option value="received">Ricevuto</option>
                      <option value="overdue">Scaduto</option>
                      <option value="cancelled">Annullato</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </div>
          </div>
          </div>
        )}
    </div>
  );
}