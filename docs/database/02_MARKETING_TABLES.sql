-- =====================================================
-- MARKETING MANAGEMENT TABLES
-- Tabelle per gestione marketing completa
-- =====================================================

-- ===== TABELLE MARKETING =====

-- Tabella Campagne Marketing
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'digital' CHECK (type IN ('digital', 'print', 'tv', 'radio', 'outdoor', 'social', 'email', 'other')),
    status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Budget e Costi
    budget DECIMAL(12,2) DEFAULT 0,
    spent_amount DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Date
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Team
    campaign_manager TEXT,
    creative_director TEXT,
    account_manager TEXT,
    
    -- Metrics
    target_impressions INTEGER DEFAULT 0,
    target_clicks INTEGER DEFAULT 0,
    target_conversions INTEGER DEFAULT 0,
    actual_impressions INTEGER DEFAULT 0,
    actual_clicks INTEGER DEFAULT 0,
    actual_conversions INTEGER DEFAULT 0,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Lead
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    
    -- Informazioni Personali
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    
    -- Lead Information
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'social', 'email', 'referral', 'advertising', 'event', 'cold_call', 'other')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    
    -- Campaign
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    
    -- Location
    country TEXT,
    city TEXT,
    address TEXT,
    
    -- Notes
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Dates
    first_contact_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_followup_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella SEO Projects
CREATE TABLE IF NOT EXISTS marketing_seo_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    website_url TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- SEO Scores
    technical_score INTEGER DEFAULT 0 CHECK (technical_score >= 0 AND technical_score <= 100),
    content_score INTEGER DEFAULT 0 CHECK (content_score >= 0 AND content_score <= 100),
    authority_score INTEGER DEFAULT 0 CHECK (authority_score >= 0 AND authority_score <= 100),
    local_score INTEGER DEFAULT 0 CHECK (local_score >= 0 AND local_score <= 100),
    
    -- Keywords
    primary_keywords TEXT[] DEFAULT '{}',
    secondary_keywords TEXT[] DEFAULT '{}',
    long_tail_keywords TEXT[] DEFAULT '{}',
    
    -- Competitors
    competitors TEXT[] DEFAULT '{}',
    competitor_analysis JSONB DEFAULT '{}',
    
    -- Goals
    target_traffic INTEGER DEFAULT 0,
    target_rankings JSONB DEFAULT '{}',
    target_conversions INTEGER DEFAULT 0,
    
    -- Budget
    monthly_budget DECIMAL(10,2) DEFAULT 0,
    spent_amount DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Team
    seo_specialist TEXT,
    content_writer TEXT,
    link_builder TEXT,
    
    -- Dates
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_review_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella CRM Campaigns
CREATE TABLE IF NOT EXISTS marketing_crm_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'email' CHECK (type IN ('email', 'sms', 'push', 'social', 'retargeting', 'other')),
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    
    -- Audience
    target_audience JSONB DEFAULT '{}',
    segment_criteria JSONB DEFAULT '{}',
    
    -- Content
    subject_line TEXT,
    content TEXT,
    call_to_action TEXT,
    
    -- Schedule
    send_date TIMESTAMP WITH TIME ZONE,
    timezone TEXT DEFAULT 'UTC',
    
    -- Metrics
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    converted_count INTEGER DEFAULT 0,
    
    -- Team
    campaign_manager TEXT,
    content_creator TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Ad Campaigns
CREATE TABLE IF NOT EXISTS marketing_ad_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    platform TEXT DEFAULT 'google' CHECK (platform IN ('google', 'facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'other')),
    type TEXT DEFAULT 'search' CHECK (type IN ('search', 'display', 'video', 'social', 'shopping', 'other')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    
    -- Budget
    daily_budget DECIMAL(10,2) DEFAULT 0,
    total_budget DECIMAL(10,2) DEFAULT 0,
    spent_amount DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Targeting
    target_keywords TEXT[] DEFAULT '{}',
    target_audiences JSONB DEFAULT '{}',
    target_locations TEXT[] DEFAULT '{}',
    
    -- Creative
    ad_headlines TEXT[] DEFAULT '{}',
    ad_descriptions TEXT[] DEFAULT '{}',
    ad_images TEXT[] DEFAULT '{}',
    landing_page_url TEXT,
    
    -- Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    cost_per_click DECIMAL(8,2) DEFAULT 0,
    cost_per_conversion DECIMAL(8,2) DEFAULT 0,
    
    -- Team
    account_manager TEXT,
    creative_director TEXT,
    
    -- Dates
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Content Calendar
CREATE TABLE IF NOT EXISTS marketing_content_calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT DEFAULT 'blog' CHECK (content_type IN ('blog', 'social', 'video', 'podcast', 'infographic', 'whitepaper', 'case_study', 'other')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('idea', 'draft', 'review', 'approved', 'published', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Content
    content TEXT,
    target_keywords TEXT[] DEFAULT '{}',
    target_audience TEXT,
    
    -- Publishing
    platform TEXT DEFAULT 'website' CHECK (platform IN ('website', 'facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'tiktok', 'other')),
    publish_date TIMESTAMP WITH TIME ZONE,
    publish_url TEXT,
    
    -- Team
    author TEXT,
    editor TEXT,
    designer TEXT,
    
    -- Metrics
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RLS E POLICY =====

-- Abilita RLS su tutte le tabelle
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_crm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_content_calendar ENABLE ROW LEVEL SECURITY;

-- Policy per accesso completo (temporanea)
CREATE POLICY "Allow all operations for now" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_seo_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_crm_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_ad_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_content_calendar FOR ALL USING (true);

-- ===== TRIGGER PER UPDATED_AT =====

CREATE TRIGGER update_campaigns_updated_at 
    BEFORE UPDATE ON campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_seo_projects_updated_at 
    BEFORE UPDATE ON marketing_seo_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_crm_campaigns_updated_at 
    BEFORE UPDATE ON marketing_crm_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_ad_campaigns_updated_at 
    BEFORE UPDATE ON marketing_ad_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_content_calendar_updated_at 
    BEFORE UPDATE ON marketing_content_calendar 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== INDICI PER PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_seo_projects_user_id ON marketing_seo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_seo_projects_status ON marketing_seo_projects(status);
CREATE INDEX IF NOT EXISTS idx_marketing_crm_campaigns_user_id ON marketing_crm_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_crm_campaigns_status ON marketing_crm_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_ad_campaigns_user_id ON marketing_ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_ad_campaigns_status ON marketing_ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_content_calendar_user_id ON marketing_content_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_content_calendar_publish_date ON marketing_content_calendar(publish_date);
