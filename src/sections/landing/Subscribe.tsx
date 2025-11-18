// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// project-imports
import FadeInWhenVisible from './Animation';
import { useBuyNowLink } from 'hooks/buyNowLink';

// ==============================|| LANDING - SUBSCRIBE ||============================== //

export default function SubscribePage() {
  const { isPhoenix } = useBuyNowLink();

  const SupportLink = isPhoenix ? 'https://phoenixcoded.authordesk.app/' : 'https://codedthemes.support-hub.io/';

  return (
    <Box sx={{ bgcolor: 'secondary.200', pb: { md: 10, xs: 7 }, pt: 0.25 }}>
      <Container>
        <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ mt: { md: 10, xs: 2.5 } }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <FadeInWhenVisible>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12}>
                  <Typography variant="h2">Need Support?</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography>
                    Have questions? Our expert support team is ready to help. Submit a ticket, and we’ll assist you promptly.
                  </Typography>
                </Grid>
              </Grid>
            </FadeInWhenVisible>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FadeInWhenVisible>
              <Grid container spacing={2} justifyContent={{ md: 'end', xs: 'center' }} alignItems="center">
                <Grid>
                  <Button variant="contained" color="primary" size="large" component={Link} href={SupportLink} target="_blank">
                    Get Support
                  </Button>
                </Grid>
              </Grid>
            </FadeInWhenVisible>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
