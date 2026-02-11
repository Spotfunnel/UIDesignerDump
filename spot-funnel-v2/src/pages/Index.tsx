import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Benefits } from '@/components/landing/Benefits';
import { UseCases } from '@/components/landing/UseCases';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { NotificationPrompt } from '@/components/NotificationPrompt';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if URL has auth tokens
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      const error = hashParams.get('error');

      if (error) {
        console.error('Auth error detected:', error, hashParams.get('error_description'));
        return;
      }

      if (accessToken && (type === 'invite' || type === 'recovery')) {
        console.log('Auth callback detected, establishing session...');

        // Wait for session to be established using the token
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error establishing session:', error);
        }

        if (session) {
          console.log('Session established, redirecting to update-password');
          // Use window.location to ensure a hard redirect with session
          navigate('/update-password');
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <UseCases />

      <Pricing />
      <FAQ />
      <Footer />
      <NotificationPrompt />
    </div>
  );
};

export default Index;
