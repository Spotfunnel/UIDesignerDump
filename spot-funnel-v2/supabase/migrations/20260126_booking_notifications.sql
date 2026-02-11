-- Create the trigger function to send push notifications on specific booking events
CREATE OR REPLACE FUNCTION public.notify_on_booking_event()
RETURNS TRIGGER AS $$
DECLARE
    call_squad_id TEXT;
    payload JSONB;
    row_data JSONB;
    phone_number TEXT;
BEGIN
    -- Convert the row to JSONB to safely access fields even if schema drift occurs
    row_data := to_jsonb(NEW);
    
    -- Extract fields safely using JSON operators
    -- This prevents hard crashes if a column is renamed or dropped in the future
    call_squad_id := COALESCE(
        row_data->>'squad_id', 
        NULL
    );

    -- Robust phone number resolution strategy
    phone_number := COALESCE(
        row_data->>'customer_phone',
        row_data->>'caller_number',
        row_data->>'phone',
        'Unknown Caller'
    );

    -- Trigger for:
    -- 1. Any new record inserted with a booking status
    -- 2. Any existing record where booking_status changes to a 'booked' state
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

        -- We use Supabase's built-in pg_net to call the Edge Function
        -- Safe execution block
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
            -- Fail silently on notification error, do NOT rollback the transaction
            -- The booking data is more important than the ping
            RAISE WARNING 'Notification failed: %', SQLERRM;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger
DROP TRIGGER IF EXISTS trigger_notify_on_booking ON public.calls;
CREATE TRIGGER trigger_notify_on_booking
AFTER INSERT OR UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_booking_event();
