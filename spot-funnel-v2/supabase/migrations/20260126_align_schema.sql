-- Ensure all columns from n8n payload exist
ALTER TABLE public.calls
  ADD COLUMN IF NOT EXISTS squad_id TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS caller_name TEXT,
  ADD COLUMN IF NOT EXISTS booking_status TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS transcript TEXT,
  ADD COLUMN IF NOT EXISTS intent TEXT,
  ADD COLUMN IF NOT EXISTS resolution_status TEXT,
  ADD COLUMN IF NOT EXISTS verified TEXT,
  ADD COLUMN IF NOT EXISTS date TEXT,
  ADD COLUMN IF NOT EXISTS "called at" TEXT,
  ADD COLUMN IF NOT EXISTS customer_address TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS call_id TEXT;

-- Recommended: Index frequently queried columns for performance
CREATE INDEX IF NOT EXISTS idx_calls_squad_id ON public.calls(squad_id);
CREATE INDEX IF NOT EXISTS idx_calls_date ON public.calls(date);
CREATE INDEX IF NOT EXISTS idx_calls_booking_status ON public.calls(booking_status);
