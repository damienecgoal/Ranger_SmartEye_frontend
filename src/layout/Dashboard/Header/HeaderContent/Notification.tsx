import { useRef, useState, useEffect } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Badge from '@mui/material/Badge';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

// project-imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// assets
import { Warning2, MessageText1, Notification, Setting2, Icon, Refresh } from 'iconsax-reactjs';

// types
import { Alarm, ALARM_SEVERITY } from 'types/development/alarm'; // Update with your actual path

//api
import { getalarm } from 'api/development/alarm'; // Adjust import path as needed
import { useNavigate } from 'react-router';
import { FormattedMessage } from 'react-intl';

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

type AlarmSeverity = {
  [key: number]: {
    label: string;
    color: string;
    icon: Icon;
  };
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function NotificationPage() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef<any>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch alarms when component mounts or when notification panel opens
  useEffect(() => {

    fetchAlarms();

  }, [open]);

  const fetchAlarms = async () => {
    setLoading(true);
    try {
      // If getalarm expects (page, pageSize, filters)
      const res = await getalarm(0, 10, {});
      // Narrow the unknown response and safely read .data
      const data = (res as { data?: Alarm[] } | undefined)?.data ?? [];
      setAlarms(data);
    } catch (err) {
      console.error('Error fetching alarms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavAlarms = async () => {
    try {
      setOpen(false);
      navigate(`/apps/alarm`, {
        state: {
          from: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp * 1000;

    // Less than 1 minute
    if (diff < 60000) return <><FormattedMessage id={'timeformat now'} /></>;

    // Less than 1 hour
    if (diff < 3600000) return <>{Math.floor(diff / 60000)}<FormattedMessage id={'timeformat min'} /></>;

    // Less than 1 day
    if (diff < 86400000) return <>{Math.floor(diff / 3600000)}<FormattedMessage id={'timeformat hours'} /></>;

    // Less Than 1 week
    if (diff < 604800000) return <>{Math.floor(diff / 86400000)}<FormattedMessage id={'timeformat days'} /></>;

    // Less Than 1 month
    if (diff < 2592000000) return <>{Math.floor(diff / 604800000)}<FormattedMessage id={'timeformat weeks'} /></>;

    // More than 1 day - show date
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Get unread alarm count (assuming status 0 = unread/active)
  const unreadCount = !alarms ? 0 : alarms?.filter(alarm => alarm.status === 0).length;
  // const unreadCount = 0;

  return (
    <Box sx={{ flexShrink: 0, ml: 0.5 }}>
      <IconButton
        color="secondary"
        variant="light"
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'notification-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        size="large"
        sx={(theme) => ({
          p: 1,
          color: 'secondary.main',
          bgcolor: open ? 'secondary.200' : 'secondary.100',
          ...theme.applyStyles('dark', { bgcolor: open ? 'background.paper' : 'background.default' })
        })}
      >
        <Badge badgeContent={unreadCount} color="error" slotProps={{ badge: { sx: { top: 2, right: 4 } } }}>
          <Notification variant="Bold" />
        </Badge>
      </IconButton>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, borderRadius: 1.5, width: { xs: 320, sm: 420 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} content={false}>
                  <CardContent>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h5"><FormattedMessage id={'alarm title'} /></Typography>
                      <IconButton size="large" color="primary" onClick={fetchAlarms}>
                        <Refresh variant="Outline" />
                      </IconButton>
                    </Stack>
                    <SimpleBar style={{ maxHeight: 'calc(100vh - 180px)' }}>
                      {loading ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Loading alarms...
                          </Typography>
                        </Box>
                      ) : !alarms || alarms?.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            No active alarms
                          </Typography>
                        </Box>
                      ) : (
                        <List
                          component="nav"
                          sx={(theme) => ({
                            '& .MuiListItemButton-root': {
                              p: 1.5,
                              my: 1.5,
                              border: `1px solid ${theme.palette.divider}`,
                              '&:hover': { bgcolor: 'primary.lighter', borderColor: 'primary.light' },
                              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
                              '&:hover .MuiAvatar-root': { bgcolor: 'primary.main', color: 'background.paper' }
                            }
                          })}
                        >
                          {alarms.map((alarm) => {
                            const severityInfo = ALARM_SEVERITY[alarm.type] || { label: 'Unknown', color: 'default', icon: Setting2 };
                            const IconComponent = severityInfo.icon;

                            return (
                              <ListItem
                                key={alarm.key}
                                component={ListItemButton}
                                onClick={() => {
                                  // Handle alarm click - mark as read, navigate, etc.
                                  console.log('Alarm clicked:', alarm);
                                }}
                                secondaryAction={
                                  <Stack alignItems="flex-end" spacing={0.5}>
                                    <Typography variant="caption" noWrap>
                                      {formatTime(alarm.timestamp)}
                                    </Typography>
                                    <Chip
                                      label={severityInfo.label}
                                      size="small"
                                      color={severityInfo.color as any}
                                      variant={alarm.status === 0 ? "filled" : "outlined"}
                                    />
                                  </Stack>
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    type="filled"
                                    color={severityInfo.color as any}
                                    sx={{
                                      bgcolor: alarm.status === 0 ? `${severityInfo.color}.main` : 'grey.300',
                                      color: alarm.status === 0 ? 'background.paper' : 'text.secondary'
                                    }}
                                  >
                                    <IconComponent size={20} variant="Bold" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography variant="h6" sx={{ fontWeight: alarm.status === 0 ? 'bold' : 'normal' }}>
                                      {alarm.desc}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                      }}
                                    >
                                      {alarm.device_id}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      )}
                    </SimpleBar>
                    <Stack direction="row" sx={{ justifyContent: 'center', cursor: 'pointer', mt: 1.5 }}>
                      <Typography variant="h6" color="primary" onClick={handleNavAlarms}>
                        <FormattedMessage id={'alarm all alarms'} />
                      </Typography>
                    </Stack>
                  </CardContent>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}




