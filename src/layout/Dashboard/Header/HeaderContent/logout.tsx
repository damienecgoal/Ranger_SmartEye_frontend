import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Setting2, Profile, Logout as LogoutIcon } from 'iconsax-reactjs';
import useAuth from 'hooks/useAuth';

// ==============================|| HEADER CONTENT - FULLSCREEN ||============================== //

export default function Logout() {

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/login`, {
        state: {
          from: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <Tooltip title="Back To Entry">
                <IconButton size="large" color="error" sx={{ p: 1 }} onClick={handleLogout}>
                    <LogoutIcon variant="Bulk" />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
