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

import DeviceList from 'components/development/DeviceList';

// assets
import { Warning2, MessageText1, Notification, Setting2, Icon, Refresh } from 'iconsax-reactjs';

// types
import { Alarm, AlarmSeverity, ALARM_SEVERITY } from 'types/development/alarm'; // Update with your actual path
import { filter } from 'lodash-es';

//api
import { getalarm } from 'api/development/alarm'; // Adjust import path as needed
import { Device } from 'types/development/devices';
import { FormattedMessage } from 'react-intl';

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};


// Alarm type to severity mapping

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function NotificationPage() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef<any>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device[]>([]);

  // Add pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(8); // Fixed page size

  // Fetch alarms when component mounts or when notification panel opens
  useEffect(() => {
    console.log('Selected Device IDs:', JSON.stringify(selectedDevice));
    fetchAlarms(0); // Reset to page 0 when filters change
  }, [selectedDevice]);

    const fetchAlarms = async (page: number = 0)=> {
      setLoading(true);
      try {
        // If getalarm expects (page, pageSize, filters)
        const res = await getalarm(page, pageSize, !selectedDevice ? {} : { device_id: selectedDevice[0]?.id?.toString() });
        // Narrow the unknown response and safely read .data
        const data = (res as { data?: Alarm[] } | undefined)?.data ?? [];
        const totalcount = (res as { totalCount?: number } | undefined)?.totalCount ?? 0;
        
        setAlarms(data);
        setCurrentPage(page);
        setTotalItems(totalcount); // Update this if your API provides total count
      } catch (err) {
        console.error('Error fetching alarms:', err);
      } finally {
        setLoading(false);
      }
    };


  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleNextPage = () => {
    fetchAlarms(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchAlarms(currentPage - 1);
    }
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

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'row',
      alignItems: 'top',
      justifyContent: 'left', gap: 2, flexShrink: 0, ml: 0.5
    }}>
      <DeviceList selectionMode="single" onDevicesSelected={setSelectedDevice} />
      <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, borderRadius: 1.5, width: '55vw' })}>
        <ClickAwayListener onClickAway={handleClose}>
          <MainCard border={false} content={false}>
            <CardContent>
              {/* Updated Header with Pagination Controls */}
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h5"><FormattedMessage id={'alarm title'} /></Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">

                  {/* Pagination Controls */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton 
                      size="small" 
                      onClick={handlePrevPage}
                      disabled={currentPage === 0 || loading}
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider',
                        '&:disabled': { opacity: 0.5 }
                      }}
                    >
                      ←
                    </IconButton>
                    
                   {/* Item Count Display */}
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage id={'pagnation showing'} /> {alarms?.length > 0 ? (currentPage * pageSize) + 1 : 0} - {(currentPage * pageSize) + alarms?.length} <FormattedMessage id={'pagnation of'} /> 
                    {totalItems > 0 && ` ${totalItems}`}
                  </Typography>

                    <IconButton 
                      size="small" 
                      onClick={handleNextPage}
                      disabled={loading || alarms?.length < pageSize}
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider',
                        '&:disabled': { opacity: 0.5 }
                      }}
                    >
                      →
                    </IconButton>
                  </Stack>
                  <IconButton size="large" color="primary"  onClick={() => fetchAlarms(currentPage)}>
                    <Refresh variant="Outline" />
                  </IconButton>
                </Stack>
              </Stack>

              <SimpleBar style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {loading ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage id={'alarm loading'} />
                    </Typography>
                  </Box>
                ) : !alarms || alarms?.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage id={'alarm not found'} />
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
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
                      }
                    })}
                  >
                    {alarms.map((alarm, index) => {
                      const severityInfo = ALARM_SEVERITY[alarm.type] || { label: 'Unknown', color: 'default', icon: Setting2 };
                      const IconComponent = severityInfo.icon;

                      return (
                        <ListItem
                          key={alarm.key}
                          component={ListItemButton}
                          onClick={() => {
                            console.log('Alarm clicked:', alarm);
                          }}
                          secondaryAction={
                            <Stack alignItems="flex-end" spacing={0.5}>
                              <Typography variant="caption" noWrap component="span">
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
                                <Typography 
                                  component="span" 
                                  variant="h6"
                                  sx={{ fontWeight: alarm.status === 0 ? 'bold' : 'normal' }}
                                >
                                  {alarm.device_id}
                                </Typography>
                              }
                              secondary={
                                <Typography 
                                  component="span" 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {alarm.desc}
                                </Typography>
                              }
                              primaryTypographyProps={{ component: "div" }}
                              secondaryTypographyProps={{ component: "div" }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </SimpleBar>
              </CardContent>
            </MainCard>
          </ClickAwayListener>
        </Paper>
      </Box>
    );
  }
