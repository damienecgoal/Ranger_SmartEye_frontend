import { useEffect, useState, SyntheticEvent } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

// material-ui
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// project-imports
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';

// assets
import { DocumentText, Lock, Profile, Profile2User, Setting3, TableDocument } from 'iconsax-reactjs';

// ==============================|| PROFILE - ACCOUNT ||============================== //

export default function AccountProfile() {
  const { pathname } = useLocation();

  let selectedTab = 0;
  let breadcrumbTitle = '';
  let breadcrumbHeading = '';
  switch (pathname) {
    case '/apps/profiles/account/personal':
      breadcrumbTitle = 'personal';
      breadcrumbHeading = 'personal';
      selectedTab = 1;
      break;
    case '/apps/profiles/account/my-account':
      breadcrumbTitle = 'my account';
      breadcrumbHeading = 'my account';
      selectedTab = 2;
      break;
    case '/apps/profiles/account/password':
      breadcrumbTitle = 'change password';
      breadcrumbHeading = 'change password';
      selectedTab = 3;
      break;
    case '/apps/profiles/account/role':
      breadcrumbTitle = 'role';
      breadcrumbHeading = 'accountant';
      selectedTab = 4;
      break;
    case '/apps/profiles/account/settings':
      breadcrumbTitle = 'settings';
      breadcrumbHeading = 'account settings';
      selectedTab = 5;
      break;
    case '/apps/profiles/account/basic':
    default:
      breadcrumbTitle = 'basic';
      breadcrumbHeading = 'basic account';
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'account-profile', to: '/apps/profiles/account/basic' },
    { title: breadcrumbTitle }
  ];
  if (selectedTab === 0) {
    breadcrumbLinks = [{ title: 'home', to: APP_DEFAULT_PATH }, { title: 'account-profile' }];
  }

  useEffect(() => {
    if (pathname === '/apps/profiles/account/basic') {
      setValue(0);
    }
  }, [pathname]);

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false}>
        <Stack sx={{ gap: GRID_COMMON_SPACING }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
              <Tab label="Profile" component={Link} to="/apps/profiles/account/basic" icon={<Profile />} iconPosition="start" />
              <Tab label="Personal" component={Link} to="/apps/profiles/account/personal" icon={<DocumentText />} iconPosition="start" />
              <Tab
                label="My Account"
                component={Link}
                to="/apps/profiles/account/my-account"
                icon={<TableDocument />}
                iconPosition="start"
              />
              <Tab label="Change Password" component={Link} to="/apps/profiles/account/password" icon={<Lock />} iconPosition="start" />
              <Tab label="Role" component={Link} to="/apps/profiles/account/role" icon={<Profile2User />} iconPosition="start" />
              <Tab label="Settings" component={Link} to="/apps/profiles/account/settings" icon={<Setting3 />} iconPosition="start" />
            </Tabs>
          </Box>
          <Outlet />
        </Stack>
      </MainCard>
    </>
  );
}
