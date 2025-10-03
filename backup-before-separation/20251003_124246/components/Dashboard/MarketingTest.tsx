'use client';

import React, { useState } from 'react';
import {
  testMarketingConnection,
  saveSEOProject,
  loadSEOProjects,
  saveCRMCampaign,
  loadCRMCampaigns,
  saveCRMContact,
  loadCRMContacts,
  saveAdCampaign,
  loadAdCampaigns,
  saveContentCalendar,
  loadContentCalendar,
  saveNewsletterTemplate,
  loadNewsletterTemplates,
  saveNewsletterCampaign,
  loadNewsletterCampaigns,
  saveQuickQuote,
  loadQuickQuotes,
  SEOProject,
  CRMCampaign,
  CRMContact,
  AdCampaign,
  ContentCalendar,
  NewsletterTemplate,
  NewsletterCampaign,
  QuickQuote
} from '@/lib/supabase';

export default function MarketingTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    const results: any[] = [];

    // Test 1: Connection
    try {
      const connResult = await testMarketingConnection();
      results.push({
        name: 'Connessione Database Marketing',
        status: connResult.success ? 'SUCCESS' : 'ERROR',
        message: connResult.message,
        details: connResult.data
      });
    } catch (error: any) {
      results.push({
        name: 'Connessione Database Marketing',
        status: 'ERROR',
        message: `Errore di connessione: ${error.message}`,
        details: error
      });
    }

    // Test 2: Save SEO Project
    try {
      const newSEOProject: Omit<SEOProject, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        name: 'Test SEO Project',
        website_url: 'https://test-website.com',
        status: 'active',
        priority: 'high',
        technical_score: 75,
        content_score: 60,
        authority_score: 45,
        local_score: 80,
        primary_keywords: ['test keyword', 'seo test'],
        secondary_keywords: ['secondary test'],
        long_tail_keywords: ['long tail test keyword'],
        competitors: ['competitor1.com', 'competitor2.com'],
        competitor_analysis: {},
        target_traffic: 1000,
        target_rankings: {},
        target_conversions: 50,
        monthly_budget: 2000.00,
        spent_amount: 0,
        currency: 'EUR',
        seo_specialist: 'Test SEO Specialist',
        start_date: new Date().toISOString(),
        attachments: []
      };
      const savedSEOProject = await saveSEOProject(newSEOProject);
      results.push({
        name: 'Salvataggio SEO Project',
        status: 'SUCCESS',
        message: `SEO Project salvato con ID: ${savedSEOProject.id}`,
        details: savedSEOProject
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio SEO Project',
        status: 'ERROR',
        message: `Errore salvataggio SEO Project: ${error.message}`,
        details: error
      });
    }

    // Test 3: Save CRM Campaign
    try {
      const newCRMCampaign: Omit<CRMCampaign, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        name: 'Test CRM Campaign',
        description: 'Campagna di test per CRM',
        campaign_type: 'email',
        status: 'active',
        target_audience: { new_subscribers: true },
        segment_criteria: {},
        estimated_reach: 1000,
        subject_line: 'Test Email Subject',
        trigger_conditions: {},
        automation_rules: {},
        follow_up_sequence: [],
        sent_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0,
        converted_count: 0,
        budget: 500.00,
        cost_per_click: 0.50,
        cost_per_conversion: 25.00,
        tags: ['test', 'crm']
      };
      const savedCRMCampaign = await saveCRMCampaign(newCRMCampaign);
      results.push({
        name: 'Salvataggio CRM Campaign',
        status: 'SUCCESS',
        message: `CRM Campaign salvata con ID: ${savedCRMCampaign.id}`,
        details: savedCRMCampaign
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio CRM Campaign',
        status: 'ERROR',
        message: `Errore salvataggio CRM Campaign: ${error.message}`,
        details: error
      });
    }

    // Test 4: Save CRM Contact
    try {
      const newCRMContact: Omit<CRMContact, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567890',
        company: 'Test Company',
        job_title: 'Test Manager',
        source: 'website',
        lead_score: 75,
        status: 'new',
        country: 'Italy',
        city: 'Milan',
        industry: 'Technology',
        company_size: '10-50',
        total_opens: 0,
        total_clicks: 0,
        total_conversions: 0,
        custom_fields: {},
        tags: ['test', 'lead'],
        consent_given: true,
        consent_date: new Date().toISOString()
      };
      const savedCRMContact = await saveCRMContact(newCRMContact);
      results.push({
        name: 'Salvataggio CRM Contact',
        status: 'SUCCESS',
        message: `CRM Contact salvato con ID: ${savedCRMContact.id}`,
        details: savedCRMContact
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio CRM Contact',
        status: 'ERROR',
        message: `Errore salvataggio CRM Contact: ${error.message}`,
        details: error
      });
    }

    // Test 5: Save Ad Campaign
    try {
      const newAdCampaign: Omit<AdCampaign, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        name: 'Test Ad Campaign',
        description: 'Campagna pubblicitaria di test',
        platform: 'google',
        campaign_type: 'search',
        status: 'active',
        target_audience: { keywords: ['test keyword'] },
        demographics: {},
        interests: {},
        locations: ['Italy'],
        daily_budget: 100.00,
        total_budget: 3000.00,
        bid_strategy: 'manual',
        bid_amount: 2.50,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roas: 0,
        tags: ['test', 'ads']
      };
      const savedAdCampaign = await saveAdCampaign(newAdCampaign);
      results.push({
        name: 'Salvataggio Ad Campaign',
        status: 'SUCCESS',
        message: `Ad Campaign salvata con ID: ${savedAdCampaign.id}`,
        details: savedAdCampaign
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio Ad Campaign',
        status: 'ERROR',
        message: `Errore salvataggio Ad Campaign: ${error.message}`,
        details: error
      });
    }

    // Test 6: Save Content Calendar
    try {
      const newContent: Omit<ContentCalendar, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        title: 'Test Content Post',
        content_type: 'blog_post',
        status: 'draft',
        description: 'Contenuto di test per il calendario editoriale',
        content: 'Questo è un contenuto di test per verificare il funzionamento del sistema.',
        target_keywords: ['test content', 'blog post'],
        social_platforms: ['facebook', 'twitter'],
        social_copies: {},
        views: 0,
        shares: 0,
        comments: 0,
        engagement_rate: 0,
        tags: ['test', 'content'],
        categories: ['marketing']
      };
      const savedContent = await saveContentCalendar(newContent);
      results.push({
        name: 'Salvataggio Content Calendar',
        status: 'SUCCESS',
        message: `Content salvato con ID: ${savedContent.id}`,
        details: savedContent
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio Content Calendar',
        status: 'ERROR',
        message: `Errore salvataggio Content: ${error.message}`,
        details: error
      });
    }

    // Test 7: Save Newsletter Template
    try {
      const newTemplate: Omit<NewsletterTemplate, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        name: 'Test Newsletter Template',
        description: 'Template di test per newsletter',
        template_type: 'standard',
        subject_line: 'Test Newsletter Subject',
        html_content: '<html><body><h1>Test Newsletter</h1><p>Contenuto di test</p></body></html>',
        text_content: 'Test Newsletter\nContenuto di test',
        preview_text: 'Anteprima del contenuto di test',
        brand_colors: { primary: '#007bff', secondary: '#6c757d' },
        fonts: { heading: 'Arial', body: 'Arial' },
        is_default: false,
        is_active: true,
        sent_count: 0,
        open_rate: 0,
        click_rate: 0,
        tags: ['test', 'newsletter']
      };
      const savedTemplate = await saveNewsletterTemplate(newTemplate);
      results.push({
        name: 'Salvataggio Newsletter Template',
        status: 'SUCCESS',
        message: `Template salvato con ID: ${savedTemplate.id}`,
        details: savedTemplate
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio Newsletter Template',
        status: 'ERROR',
        message: `Errore salvataggio Template: ${error.message}`,
        details: error
      });
    }

    // Test 8: Save Newsletter Campaign
    try {
      const newCampaign: Omit<NewsletterCampaign, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        name: 'Test Newsletter Campaign',
        subject_line: 'Test Campaign Subject',
        status: 'draft',
        html_content: '<html><body><h1>Test Campaign</h1></body></html>',
        text_content: 'Test Campaign Content',
        target_segments: ['test-segment'],
        exclude_segments: [],
        estimated_recipients: 1000,
        sent_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0,
        unsubscribed_count: 0,
        bounced_count: 0,
        tags: ['test', 'campaign']
      };
      const savedCampaign = await saveNewsletterCampaign(newCampaign);
      results.push({
        name: 'Salvataggio Newsletter Campaign',
        status: 'SUCCESS',
        message: `Campaign salvata con ID: ${savedCampaign.id}`,
        details: savedCampaign
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio Newsletter Campaign',
        status: 'ERROR',
        message: `Errore salvataggio Campaign: ${error.message}`,
        details: error
      });
    }

    // Test 9: Save Quick Quote
    try {
      const newQuote: Omit<QuickQuote, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        client_name: 'Test Client',
        client_email: 'client@test.com',
        client_phone: '+1234567890',
        company: 'Test Company',
        service_type: 'seo',
        project_description: 'Progetto SEO di test',
        estimated_duration: '3 mesi',
        base_price: 1500.00,
        additional_services: [],
        total_price: 1500.00,
        currency: 'EUR',
        payment_terms: '50% upfront, 50% on completion',
        validity_days: 30,
        status: 'draft'
      };
      const savedQuote = await saveQuickQuote(newQuote);
      results.push({
        name: 'Salvataggio Quick Quote',
        status: 'SUCCESS',
        message: `Quote salvato con ID: ${savedQuote.id}`,
        details: savedQuote
      });
    } catch (error: any) {
      results.push({
        name: 'Salvataggio Quick Quote',
        status: 'ERROR',
        message: `Errore salvataggio Quote: ${error.message}`,
        details: error
      });
    }

    // Test 10: Load All Data
    try {
      const [seoProjects, crmCampaigns, crmContacts, adCampaigns, contentCalendar, newsletterTemplates, newsletterCampaigns, quickQuotes] = await Promise.all([
        loadSEOProjects(),
        loadCRMCampaigns(),
        loadCRMContacts(),
        loadAdCampaigns(),
        loadContentCalendar(),
        loadNewsletterTemplates(),
        loadNewsletterCampaigns(),
        loadQuickQuotes()
      ]);

      results.push({
        name: 'Caricamento Tutti i Dati Marketing',
        status: 'SUCCESS',
        message: `Dati caricati - SEO: ${seoProjects.length}, CRM: ${crmCampaigns.length}, Ads: ${adCampaigns.length}, Content: ${contentCalendar.length}, Templates: ${newsletterTemplates.length}, Campaigns: ${newsletterCampaigns.length}, Quotes: ${quickQuotes.length}`,
        details: {
          seoProjects: seoProjects.length,
          crmCampaigns: crmCampaigns.length,
          crmContacts: crmContacts.length,
          adCampaigns: adCampaigns.length,
          contentCalendar: contentCalendar.length,
          newsletterTemplates: newsletterTemplates.length,
          newsletterCampaigns: newsletterCampaigns.length,
          quickQuotes: quickQuotes.length
        }
      });
    } catch (error: any) {
      results.push({
        name: 'Caricamento Tutti i Dati Marketing',
        status: 'ERROR',
        message: `Errore caricamento dati: ${error.message}`,
        details: error
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🧪 Test Database Marketing</h2>
      <p className="text-gray-600 mb-4">
        Esegui i test per verificare la connessione e le operazioni CRUD (Create, Read, Update, Delete)
        per tutte le tabelle marketing: SEO, CRM, Ads, Content, Newsletter e Quotes.
      </p>
      <button
        onClick={runAllTests}
        disabled={loading}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          loading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? 'Esecuzione test...' : 'Avvia Test Completo Marketing'}
      </button>

      {testResults.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Risultati Test:</h3>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                result.status === 'SUCCESS' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${result.status === 'SUCCESS' ? 'text-green-800' : 'text-red-800'}`}>
                  {result.status === 'SUCCESS' ? '✅' : '❌'} {result.name}
                </span>
                <span className={`text-sm ${result.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status}
                </span>
              </div>
              <p className="text-gray-700 mt-1 text-sm">{result.message}</p>
              {result.details && (
                <pre className="mt-2 p-2 bg-gray-100 rounded-md text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
