'use client';

import { useState } from 'react';
import SectionTests from './SectionTests';
import RecurringActivitiesTest from './RecurringActivitiesTest';
import { supabase } from '@/lib/supabase';

export default function UnifiedSectionTests() {
  const [activeSection, setActiveSection] = useState('marketing');

  const sections = {
    marketing: {
      name: 'Marketing',
      icon: '📈',
      tables: ['campaigns', 'leads', 'marketing_seo_projects', 'marketing_seo_tasks', 'marketing_crm_campaigns', 'marketing_crm_contacts', 'marketing_ad_campaigns', 'marketing_ad_groups', 'marketing_content_calendar', 'marketing_social_accounts', 'marketing_reports', 'marketing_newsletter_templates', 'marketing_newsletter_campaigns', 'marketing_quick_quotes'],
      testFunctions: {
        loadCampaigns: async () => {
          const { data, error } = await supabase.from('campaigns').select('*');
          if (error) throw error;
          return data;
        },
        loadLeads: async () => {
          const { data, error } = await supabase.from('leads').select('*');
          if (error) throw error;
          return data;
        },
        saveCampaign: async () => {
          const testCampaign = {
            name: 'Test Campaign',
            channel: 'test',
            start_date: new Date().toISOString().split('T')[0],
            budget: 1000,
            spent: 0,
            leads: 0,
            conversions: 0,
            revenue: 0,
            status: 'active'
          };
          const { data, error } = await supabase.from('campaigns').insert(testCampaign).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('campaigns').delete().eq('id', data[0].id);
          }
          return data;
        },
        saveLead: async () => {
          const testLead = {
            name: 'Test Lead',
            email: 'test@example.com',
            source: 'test',
            campaign: 'test',
            status: 'new',
            value: 0,
            date: new Date().toISOString().split('T')[0]
          };
          const { data, error } = await supabase.from('leads').insert(testLead).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('leads').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    },
    projects: {
      name: 'Progetti',
      icon: '🚀',
      tables: ['projects_main', 'project_objectives', 'project_budget', 'project_team', 'project_milestones', 'project_risks'],
      testFunctions: {
        loadProjects: async () => {
          const { data, error } = await supabase.from('projects_main').select('*');
          if (error) throw error;
          return data;
        },
        loadObjectives: async () => {
          const { data, error } = await supabase.from('project_objectives').select('*');
          if (error) throw error;
          return data;
        },
        saveProject: async () => {
          const testProject = {
            name: 'Test Project',
            description: 'Test project description',
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: 10000,
            project_manager: 'Test Manager'
          };
          const { data, error } = await supabase.from('projects_main').insert(testProject).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('projects_main').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    },
    tasks: {
      name: 'Task e Calendario',
      icon: '📅',
      tables: ['tasks', 'appointments', 'marketing_seo_tasks'],
      testFunctions: {
        loadTasks: async () => {
          const { data, error } = await supabase.from('tasks').select('*');
          if (error) throw error;
          return data;
        },
        loadAppointments: async () => {
          const { data, error } = await supabase.from('appointments').select('*');
          if (error) throw error;
          return data;
        },
        saveTask: async () => {
          const testTask = {
            title: 'Test Task',
            description: 'Test task description',
            status: 'pending',
            priority: 'medium',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            assigned_to: 'Test User'
          };
          const { data, error } = await supabase.from('tasks').insert(testTask).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('tasks').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    },
    financial: {
      name: 'Gestione Finanziaria',
      icon: '💰',
      tables: ['services', 'budgets', 'investments'],
      testFunctions: {
        loadServices: async () => {
          const { data, error } = await supabase.from('services').select('*');
          if (error) throw error;
          return data;
        },
        loadBudgets: async () => {
          const { data, error } = await supabase.from('budgets').select('*');
          if (error) throw error;
          return data;
        },
        saveService: async () => {
          const testService = {
            name: 'Test Service',
            description: 'Test service description',
            price: 100,
            category: 'test',
            status: 'active'
          };
          const { data, error } = await supabase.from('services').insert(testService).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('services').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    },
    rd: {
      name: 'R&D',
      icon: '🔬',
      tables: ['rd_projects', 'rd_technologies', 'rd_patents'],
      testFunctions: {
        loadRDProjects: async () => {
          const { data, error } = await supabase.from('rd_projects').select('*');
          if (error) throw error;
          return data;
        },
        loadTechnologies: async () => {
          const { data, error } = await supabase.from('rd_technologies').select('*');
          if (error) throw error;
          return data;
        },
        saveRDProject: async () => {
          const testProject = {
            name: 'Test R&D Project',
            description: 'Test R&D project description',
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            budget: 50000,
            lead_researcher: 'Test Researcher'
          };
          const { data, error } = await supabase.from('rd_projects').insert(testProject).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('rd_projects').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    },
    business: {
      name: 'Business Plan',
      icon: '💼',
      tables: ['business_plan', 'business_metrics', 'business_goals'],
      testFunctions: {
        loadBusinessPlan: async () => {
          const { data, error } = await supabase.from('business_plan').select('*');
          if (error) throw error;
          return data;
        },
        loadMetrics: async () => {
          const { data, error } = await supabase.from('business_metrics').select('*');
          if (error) throw error;
          return data;
        },
        saveBusinessPlan: async () => {
          const testPlan = {
            name: 'Test Business Plan',
            description: 'Test business plan description',
            status: 'draft',
            created_date: new Date().toISOString().split('T')[0],
            version: '1.0'
          };
          const { data, error } = await supabase.from('business_plan').insert(testPlan).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('business_plan').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    },
    ai: {
      name: 'AI Management',
      icon: '🤖',
      tables: ['ai_models', 'ai_training_data', 'ai_predictions'],
      testFunctions: {
        loadAIModels: async () => {
          const { data, error } = await supabase.from('ai_models').select('*');
          if (error) throw error;
          return data;
        },
        loadTrainingData: async () => {
          const { data, error } = await supabase.from('ai_training_data').select('*');
          if (error) throw error;
          return data;
        },
        saveAIModel: async () => {
          const testModel = {
            name: 'Test AI Model',
            description: 'Test AI model description',
            type: 'classification',
            status: 'training',
            accuracy: 0.95
          };
          const { data, error } = await supabase.from('ai_models').insert(testModel).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('ai_models').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    },
    recurring: {
      name: 'Attività Ricorrenti',
      icon: '🔄',
      tables: ['recurring_activities', 'weekly_templates', 'template_activities'],
      testFunctions: {
        loadActivities: async () => {
          const { data, error } = await supabase.from('recurring_activities').select('*');
          if (error) throw error;
          return data;
        },
        loadTemplates: async () => {
          const { data, error } = await supabase.from('weekly_templates').select('*');
          if (error) throw error;
          return data;
        },
        saveActivity: async () => {
          const testActivity = {
            name: 'Test Activity',
            description: 'Test activity description',
            type: 'weekly',
            day_of_week: 1,
            day_of_month: null,
            time: '09:00',
            duration: 60,
            category: 'Test',
            priority: 'medium',
            is_active: true
          };
          const { data, error } = await supabase.from('recurring_activities').insert(testActivity).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('recurring_activities').delete().eq('id', data[0].id);
          }
          return data;
        },
        saveTemplate: async () => {
          const testTemplate = {
            name: 'Test Template',
            description: 'Test template description',
            is_active: true
          };
          const { data, error } = await supabase.from('weekly_templates').insert(testTemplate).select();
          if (error) throw error;
          // Cleanup
          if (data && data[0]) {
            await supabase.from('weekly_templates').delete().eq('id', data[0].id);
          }
          return data;
        }
      }
    }
  };

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg mr-3">
            <span className="text-xl text-white">🧪</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Unificati per Sezioni</h1>
            <p className="text-gray-600">Controlli completi per ogni sezione del dashboard</p>
          </div>
        </div>
      </div>

      {/* Section Selector */}
      <div className="bg-white/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Seleziona Sezione da Testare</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`p-4 rounded-lg text-center transition-all duration-200 ${
                activeSection === key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-2">{section.icon}</div>
              <div className="text-sm font-medium">{section.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Section Test */}
      {activeSection && sections[activeSection as keyof typeof sections] && (
        <>
          {activeSection === 'recurring' ? (
            <RecurringActivitiesTest />
          ) : (
            <SectionTests
              sectionName={sections[activeSection as keyof typeof sections].name}
              sectionIcon={sections[activeSection as keyof typeof sections].icon}
              tables={sections[activeSection as keyof typeof sections].tables}
              testFunctions={sections[activeSection as keyof typeof sections].testFunctions}
            />
          )}
        </>
      )}

      {/* Summary */}
      <div className="bg-white/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Riepilogo Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <div className="font-semibold text-green-800">Test Disponibili</div>
                <div className="text-2xl font-bold text-green-900">{Object.keys(sections).length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔍</span>
              <div>
                <div className="font-semibold text-blue-800">Controlli per Sezione</div>
                <div className="text-2xl font-bold text-blue-900">4</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <div className="font-semibold text-purple-800">Tabelle Totali</div>
                <div className="text-2xl font-bold text-purple-900">
                  {Object.values(sections).reduce((sum, section) => sum + section.tables.length, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
