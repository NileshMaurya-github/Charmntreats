-- Add mobile number field to customer_data table
ALTER TABLE customer_data ADD COLUMN IF NOT EXISTS mobile TEXT;

-- Create index for mobile number for better performance
CREATE INDEX IF NOT EXISTS idx_customer_data_mobile ON customer_data(mobile);

-- Update the export view or function if it exists
-- This ensures mobile numbers are included in any existing data exports