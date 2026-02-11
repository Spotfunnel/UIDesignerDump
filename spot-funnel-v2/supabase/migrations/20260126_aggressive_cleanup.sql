-- AGGRESSIVE CLEANUP
-- First, drop the trigger itself
DROP TRIGGER IF EXISTS trigger_notify_on_booking ON public.calls;

-- Drop the function completely to ensure no bad logic remains
DROP FUNCTION IF EXISTS public.notify_on_booking_event();

-- Re-create the SAFE, Anti-Fragile function
CREATE OR REPLACE FUNCTION public.notify_on_booking_event()
RETURNS TRIGGER AS $$
DECLARE
    call_squad_id TEXT;
    payload JSONB;
    row_data JSONB;
    phone_number TEXT;
BEGIN
    -- SAFETY FIRST: Convert row to JSONB to avoid "no field" errors
    row_data := to_jsonb(NEW);
    
    call_squad_id := COALESCE(row_data->>'squad_id', NULL);

    -- Hunt for the phone number without crashing
    phone_number := COALESCE(
        row_data->>'customer_phone',
        row_data->>'caller_number',
        row_data->>'phone',
        'Unknown Caller'
    );

    IF (
        (TG_OP = 'INSERT' AND NEW.booking_status IN ('booked', 'confirmed', 'rescheduled')) OR
        (TG_OP = 'UPDATE' AND NEW.booking_status IS DISTINCT FROM OLD.booking_status AND NEW.booking_status IN ('booked', 'confirmed', 'rescheduled'))
    ) THEN
        
        payload := jsonb_build_object(
            'title', 'New Booking! 🎉',
            'body', 'A new appointment has been confirmed (' || phone_number || ')',
            'squadId', call_squad_id,
            'data', jsonb_build_object(
                'type', 'booking',
                'call_id', NEW.id,
                'status', NEW.booking_status
            )
        );

        BEGIN
            PERFORM net.http_post(
                url := 'https://mskabsnklhprlmzugwbl.supabase.co/functions/v1/broadcast-push',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('vault.service_role_key', true)
                ),
                body := payload
            );
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Notification failed: %', SQLERRM;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply the trigger
CREATE TRIGGER trigger_notify_on_booking
AFTER INSERT OR UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_booking_event();
