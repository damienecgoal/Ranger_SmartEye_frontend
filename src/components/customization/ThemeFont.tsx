import { ChangeEvent } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import { HEADER_HEIGHT } from 'config';
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// types
import { FontFamily } from 'types/config';

// ==============================|| CUSTOMIZATION - FONT FAMILY ||============================== //

export default function ThemeFont() {
  const { fontFamily, onChangeFontFamily } = useConfig();

  const handleFontChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeFontFamily(event.target.value as FontFamily);
  };

  const fonts = [
    {
      id: 'inter',
      value: `Inter var`,
      label: 'Inter'
    },
    {
      id: 'roboto',
      value: `'Roboto', sans-serif`,
      label: 'Roboto'
    },
    {
      id: 'poppins',
      value: `'Poppins', sans-serif`,
      label: 'Poppins'
    },
    {
      id: 'public-sans',
      value: `'Public Sans', sans-serif`,
      label: 'Public Sans'
    }
  ];

  return (
    <RadioGroup row aria-label="payment-card" name="payment-card" value={fontFamily} onChange={handleFontChange}>
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        {fonts.map((item, index) => (
          <Grid key={index}>
            <FormControlLabel
              control={<Radio value={item.value} sx={{ display: 'none' }} />}
              sx={{ display: 'flex' }}
              slotProps={{ typography: { sx: { flex: 1 } } }}
              label={
                <MainCard
                  content={false}
                  border={false}
                  boxShadow={fontFamily === item.value}
                  sx={(theme: Theme) => ({
                    bgcolor: 'secondary.lighter',
                    p: 1,
                    ...(fontFamily === item.value && { bgcolor: 'primary.lighter', boxShadow: theme.customShadows.primary })
                  })}
                >
                  <Box sx={{ minWidth: HEADER_HEIGHT, bgcolor: 'background.paper', p: 1, '&:hover': { bgcolor: 'background.paper' } }}>
                    <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                      <Typography variant="h5" sx={{ color: 'text.primary', fontFamily: item.value }}>
                        Aa
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  </Box>
                </MainCard>
              }
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
}
