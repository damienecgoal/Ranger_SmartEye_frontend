// material-ui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project-imports
import FadeInWhenVisible from './Animation';
import { ThemeMode } from 'config';

import client1Light from 'assets/images/landing/client-eagamesLight.svg';
import client1Dark from 'assets/images/landing/client-eagamesDark.svg';
import client2Light from 'assets/images/landing/client-vodafoneLight.svg';
import client2Dark from 'assets/images/landing/client-vodafoneDark.svg';
import client3Light from 'assets/images/landing/client-crystalLight.svg';
import client3Dark from 'assets/images/landing/client-crystalDark.svg';
import client4Light from 'assets/images/landing/client-haswent-2Light.svg';
import client4Dark from 'assets/images/landing/client-haswent-2Dark.svg';
import client5Light from 'assets/images/landing/client-haxter-3Light.svg';
import client5Dark from 'assets/images/landing/client-haxter-3Dark.svg';
import client6Light from 'assets/images/landing/client-montecito-4Light.svg';
import client6Dark from 'assets/images/landing/client-montecito-4Dark.svg';
import client7Light from 'assets/images/landing/client-slingshotLight.svg';
import client7Dark from 'assets/images/landing/client-slingshotDark.svg';
import client8Light from 'assets/images/landing/client-totalstudio-5Light.svg';
import client8Dark from 'assets/images/landing/client-totalstudio-5Dark.svg';

// ==============================|| LANDING - PartnerPage ||============================== //

export default function PartnerPage() {
  const theme = useTheme();
  const items = [
    { image: theme.palette.mode === ThemeMode.DARK ? client1Dark : client1Light },
    { image: theme.palette.mode === ThemeMode.DARK ? client2Dark : client2Light },
    { image: theme.palette.mode === ThemeMode.DARK ? client3Dark : client3Light },
    { image: theme.palette.mode === ThemeMode.DARK ? client4Dark : client4Light },
    { image: theme.palette.mode === ThemeMode.DARK ? client5Dark : client5Light },
    { image: theme.palette.mode === ThemeMode.DARK ? client6Dark : client6Light },
    { image: theme.palette.mode === ThemeMode.DARK ? client7Dark : client7Light },
    { image: theme.palette.mode === ThemeMode.DARK ? client8Dark : client8Light }
  ];

  return (
    <Container>
      <Grid container spacing={3} sx={{ alignItems: 'center', justifyContent: 'center', mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}>
        <Grid size={12}>
          <Grid container spacing={2} sx={{ justifyContent: 'center', textAlign: 'center', marginBottom: 3 }}>
            <Grid size={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2
                }}
              >
                <Typography variant="h2">Trusted By</Typography>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4
                }}
              >
                <Typography>From Startups to Fortune 500 companies using our Template for their product.</Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={3} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {items.map((item, index) => (
              <Grid key={index}>
                <FadeInWhenVisible>
                  <Box
                    sx={{
                      '& img': {
                        transition: 'all 0.08s cubic-bezier(0.37, 0.24, 0.53, 0.99)',
                        filter: 'grayscale(0.8)',
                        opacity: 0.5,
                        cursor: 'pointer'
                      },
                      '&:hover img': { filter: 'grayscale(0.5)', opacity: 1 }
                    }}
                  >
                    <CardMedia component="img" image={item.image} sx={{ width: 'auto' }} />
                  </Box>
                </FadeInWhenVisible>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
