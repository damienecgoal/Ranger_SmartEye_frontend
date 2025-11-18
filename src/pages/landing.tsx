// material-ui
import Divider from '@mui/material/Divider';

// project-imports
import Hero from 'sections/landing/Hero';
import Technologies from 'sections/landing/Technologies';
import Combo from 'sections/landing/Combo';
import FigmaBlock from 'sections/landing/FigmaBlock';
import Apps from 'sections/landing/Apps';
import Free from 'sections/landing/Free';
import Testimonial from 'sections/landing/Testimonial';
import Partner from 'sections/landing/Partner';
import Subscribe from 'sections/landing/Subscribe';
import { useEffect } from 'react';

// Prefetch critical routes using Vite's prefetch
const prefetchRoutes = () => {
  // Use dynamic imports to trigger Vite's prefetching
  // These will be prefetched when the landing page loads
  import('pages/dashboard/analytics');
  import('pages/dashboard/default');
  import('pages/auth/auth1/login');
  import('pages/auth/auth1/register');
  import('pages/apps/e-commerce/product');
  import('pages/apps/invoice/dashboard');
  import('pages/apps/kanban');
  import('pages/apps/calendar');
  import('pages/apps/chat');
  import('pages/widget/chart');
  import('pages/widget/data');
  import('pages/widget/statistics');
};

// ==============================|| SAMPLE PAGE ||============================== //

export default function Landing() {
  useEffect(() => {
    // Prefetch routes after initial render
    prefetchRoutes();
  }, []);

  return (
    <>
      <Hero />
      <Technologies />
      <Combo />
      <FigmaBlock />
      <Apps />
      <Free />
      <Testimonial />
      <Partner />
      <Subscribe />
      <Divider sx={{ borderColor: 'secondary.light' }} />
    </>
  );
}
