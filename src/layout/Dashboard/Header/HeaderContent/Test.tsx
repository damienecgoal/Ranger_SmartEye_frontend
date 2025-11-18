import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import MessageCard from 'components/cards/statistics/MessageCard';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { ThemeMode } from 'config';

// assets
import { Add, NotificationStatus } from 'iconsax-reactjs';

import message1Light from 'assets/images/widget/message/message1Light.svg';
import message1Dark from 'assets/images/widget/message/message1Dark.svg';
import message2Light from 'assets/images/widget/message/message2Light.svg';
import message2Dark from 'assets/images/widget/message/message2Dark.svg';
import message3Light from 'assets/images/widget/message/message3Light.svg';
import message3Dark from 'assets/images/widget/message/message3Dark.svg';
import message4Light from 'assets/images/widget/message/message4Light.svg';
import message4Dark from 'assets/images/widget/message/message4Dark.svg';

import { openSnackbar } from 'api/snackbar';

// types
import { SnackbarProps } from 'types/snackbar';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

export default function Test() {
  const theme = useTheme();

  const message1 = theme.palette.mode === ThemeMode.DARK ? message1Dark : message1Light;
  const message2 = theme.palette.mode === ThemeMode.DARK ? message2Dark : message2Light;
  const message3 = theme.palette.mode === ThemeMode.DARK ? message3Dark : message3Light;
  const message4 = theme.palette.mode === ThemeMode.DARK ? message4Dark : message4Light;

  const [open, setOpen] = useState(false);
  const triggerSnackbar = () => {
                      openSnackbar({
                        open: true,
                        message: 'This is a default message',
                        variant: 'alert',
                        close: true
                      } as SnackbarProps)  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          color="secondary"
          variant="light"
            onClick={triggerSnackbar
                    }
          aria-label="settings toggler"
          size="large"
          sx={(theme) => ({
            p: 1,
            color: 'secondary.main',
            bgcolor: open ? 'secondary.200' : 'secondary.100',
            ...theme.applyStyles('dark', { bgcolor: open ? 'background.paper' : 'background.default' })
          })}
        >
          <NotificationStatus variant="Bulk" />
        </IconButton>
      </Box>
    
    </>
  );
}
