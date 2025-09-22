-- Fix constraint for financial_fixed_costs category
-- This allows for more flexible categories while maintaining data integrity

-- Drop the existing constraint
ALTER TABLE financial_fixed_costs DROP CONSTRAINT IF EXISTS financial_fixed_costs_category_check;

-- Add a new, more flexible constraint
ALTER TABLE financial_fixed_costs ADD CONSTRAINT financial_fixed_costs_category_check 
CHECK (category IN (
  'office', 'software', 'marketing', 'personnel', 'utilities', 'insurance', 'legal', 'other',
  'materials', 'services', 'travel', 'equipment', 'training', 'consulting',
  'rent', 'maintenance', 'communication', 'transportation', 'professional_services'
));

-- Also update the default value to be more generic
ALTER TABLE financial_fixed_costs ALTER COLUMN category SET DEFAULT 'other';
