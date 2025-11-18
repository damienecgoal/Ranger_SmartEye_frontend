import { useEffect, useState, SyntheticEvent } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// project imports
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';
import { BioBoard, Contact, Event, Followers, FollowersList, Gallery, ProfileHero, TeamPages } from 'sections/apps/profiles/social-profile';

// assets
import { Gallery as GalleryIcon, Profile2User, ProfileAdd, User } from 'iconsax-reactjs';

// ==============================|| PROFILE - SOCIAL PROFILE ||============================== //

export default function SocialProfile() {
  const { pathname } = useLocation();

  let selectedTab = 0;
  let breadcrumbTitle = 'profile';

  switch (pathname) {
    case '/apps/profiles/social-profile/friends':
      selectedTab = 1;
      breadcrumbTitle = 'friends';
      break;
    case '/apps/profiles/social-profile/friend-requests':
      selectedTab = 2;
      breadcrumbTitle = 'friend-requests';
      break;
    case '/apps/profiles/social-profile/gallery':
      selectedTab = 3;
      breadcrumbTitle = 'gallery';
      break;
    case '/apps/profiles/social-profile/profile':
    default:
      selectedTab = 0;
      breadcrumbTitle = 'profile';
  }

  const [value, setValue] = useState(selectedTab);

  useEffect(() => {
    setValue(selectedTab);
  }, [pathname, selectedTab]);

  const handleChange = (__event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'social-profile', to: '/apps/profiles/social-profile/profile' },
    { title: breadcrumbTitle }
  ];

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbTitle} links={breadcrumbLinks} />
      <Grid container spacing={GRID_COMMON_SPACING}>
        <Grid size={12}>
          <ProfileHero />
        </Grid>

        <Grid size={12}>
          <MainCard content={false}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Profile" component={Link} icon={<User size="18" />} iconPosition="start" to="profile" />
              <Tab
                component={Link}
                icon={<Profile2User size="18" />}
                iconPosition="start"
                to="friends"
                label={
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <Typography>Friends</Typography>
                    <Chip label="99" size="small" color="secondary" sx={{ color: 'secondary.lighter' }} />
                  </Stack>
                }
              />
              <Tab label="Friend Requests" component={Link} icon={<ProfileAdd size="18" />} iconPosition="start" to="friend-requests" />
              <Tab label="Gallery" component={Link} icon={<GalleryIcon size="18" />} iconPosition="start" to="gallery" />
            </Tabs>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8, xl: 9 }}>
          <Outlet />
        </Grid>

        <Grid size={{ xs: 12, md: 4, xl: 3 }}>
          <Stack spacing={GRID_COMMON_SPACING}>
            <Followers />
            <BioBoard />
            <Gallery />
            <Contact />
            <Event />
            <FollowersList />
            <TeamPages />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
