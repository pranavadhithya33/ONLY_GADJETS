-- SQL script to add new tracking steps and estimated delivery date
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS step7 TEXT,
ADD COLUMN IF NOT EXISTS step8 TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date TEXT;
