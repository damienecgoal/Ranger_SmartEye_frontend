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
import Box from '@mui/material/Box';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Chip, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

import DeviceList from 'components/development/DeviceList';
import MediaTypeFilter from 'components/development/mediaTypeFilter';
import DateRangePicker from 'components/development/dateRangePicker';

// assets
import { Warning2, MessageText1, Notification, Setting2, Icon, Refresh, CloseCircle, Calendar } from 'iconsax-reactjs';

// types
import { FileRecord } from 'types/development/files';
import { filter } from 'lodash-es';

//api
import { getPlatformFiles, getTerminalFiles, perviewPlatformFiles, perviewTerminalFiles } from 'api/development/files';
import { set } from 'date-fns';
import { se } from 'date-fns/locale';
import { Device } from 'types/development/devices';
import { FormattedMessage, useIntl } from 'react-intl';

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// File type styling helper
type ChipColor = 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'primary' | 'default';
type StatusFilter = 'platform' | 'terminal';

const getFileTypeInfo = (fileType: FileRecord['fileType']): { label: string; color: ChipColor; icon: string } => {
  const typeMap: Record<string, { label: string; color: ChipColor; icon: string }> = {
    video: { label: 'Video', color: 'error', icon: '🎬' },
    image: { label: 'Image', color: 'info', icon: '🖼️' },
    audio: { label: 'Audio', color: 'success', icon: '🎵' },
    gps: { label: 'GPS', color: 'warning', icon: '📍' },
    log: { label: 'Log', color: 'secondary', icon: '📋' },
    firmware: { label: 'Firmware', color: 'primary', icon: '⚙️' }
  };
  return typeMap[fileType as string] || { label: 'Unknown', color: 'default', icon: '📄' };
};

// File size formatter
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Date formatter
const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Alarm type to severity mapping

// ==============================|| HEADER CONTENT - FILES ||============================== //

export default function MediaPage() {
  const intl = useIntl();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef<any>(null);
  const [Media, setMedia] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [startUnix, setStartUnix] = useState<number | null>(null);
  const [endUnix, setEndUnix] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('platform');
  const [selectedTypes, setSelectedTypes] = useState<FileRecord['fileType'][]>([]);


  // Add pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(8); // Fixed page size


  const handleFilterChange = (types: FileRecord['fileType'][]) => {
    setSelectedTypes(types);
    // Your filtering logic here
    console.log('Filtered types:', types);
  };

  // Fetch Media when component mounts or when notification panel opens
  useEffect(() => {
    console.log('Selected Device IDs:', JSON.stringify(selectedDevice));
    fetchFiles(0); // Reset to page 0 when filters change
  }, [selectedDevice, statusFilter, selectedTypes,startUnix,endUnix]);

  const fetchFiles = async (page: number = 0) => {
    setLoading(true);
    try {
      let res;

      // If getalarm expects (page, pageSize, filters)
      if (statusFilter === 'terminal' && selectedDevice.length > 0) {
        res = await getTerminalFiles(
          selectedDevice[0]?.id?.toString(),
          page,
          pageSize,
          { 
            beginTime: startUnix, 
            endTime: endUnix,
            fileType: selectedTypes
          }
        );
      } else if (statusFilter === 'platform') {
        res = await getPlatformFiles(
          page,
          pageSize,
          !selectedDevice
            ? { beginTime: startUnix, endTime: endUnix, fileType: selectedTypes }
            : { beginTime: startUnix, endTime: endUnix, fileType: selectedTypes, puID: selectedDevice[0]?.id?.toString() }
        );
      }

      // Narrow the unknown response and safely read .data
      const data = (res as { data?: FileRecord[] } | undefined)?.data ?? [];
      const totalcount = (res as { totalCount?: number } | undefined)?.totalCount ?? 0;
      setMedia(data);
      setCurrentPage(page);
      setTotalItems(totalcount); // Update this if your API provides total count
    } catch (err) {
      console.error('Error fetching Media:', err);
      setMedia([]);
      setTotalItems(0);
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
    fetchFiles(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchFiles(currentPage - 1);
    }
  };

  const handleStatusFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: StatusFilter) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };

  const handleFileClick = (file: FileRecord) => {
    setSelectedFile(file);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDateRangeChange = (startUnix: number | null, endUnix: number | null) => {
    console.log('Start Date (Unix):', startUnix);
    console.log('End Date (Unix):', endUnix);
    setStartUnix(startUnix);
    setEndUnix(endUnix);
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
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" sx={{ alignItems: 'center', gap:2 }}>

                <Typography variant="h5">
                  <FormattedMessage id={'media title'} />
                </Typography>

                  <ToggleButtonGroup
                    color="primary"
                    value={statusFilter}
                    exclusive
                    onChange={handleStatusFilterChange}
                    aria-label="device status filter"
                    fullWidth
                    size="small"
                  >
                    <ToggleButton value="platform" aria-label="all devices" sx={{ minWidth: '65px' }}>
                      <FormattedMessage id={'media platform'} />
                    </ToggleButton>
                    <ToggleButton value="terminal" aria-label="online devices" sx={{ minWidth: '65px' }}>
                      <FormattedMessage id={'media terminal'} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                  </Stack>
                <IconButton size="large" color="primary" onClick={() => fetchFiles(currentPage)}>
                  <Refresh variant="Outline" />
                </IconButton>
              </Stack>

              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                  <MediaTypeFilter
                    selectedTypes={selectedTypes}
                    onFilterChange={handleFilterChange}
                    label={intl.formatMessage({ id: 'media filter title' })}
                  />
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
                      <FormattedMessage id={'pagnation showing'} /> {Media?.length > 0 ? (currentPage * pageSize) + 1 : 0} - {(currentPage * pageSize) + Media?.length} <FormattedMessage id={'pagnation of'} />
                      {totalItems > 0 && ` ${totalItems}`}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={handleNextPage}
                      disabled={loading || Media?.length < pageSize}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:disabled': { opacity: 0.5 }
                      }}
                    >
                      →
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>

              <SimpleBar style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {loading ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage id={'media loading'} />
                    </Typography>
                  </Box>
                ) : !Media || Media?.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage id={'media no active'} />
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
                        '& .MuiListItemSecondaryAction-root': {
                          position: 'relative',
                          right: 0,
                          transform: 'none'
                        },
                      }
                    })}
                  >
                    {Media.map((file: FileRecord) => {
                      // File type styling
                      const fileTypeInfo = getFileTypeInfo(file.fileType);

                      // Format file size
                      const formattedSize = formatFileSize(file.fileSize);

                      // Format timestamps
                      const formattedBeginTime = formatDateTime(file.beginTime);
                      const formattedInsertTime = formatDateTime(file.insertTime);

                      // Status chip (mark status)
                      const statusInfo = file.mark
                        ? { label: 'Marked', color: 'primary' as const }
                        : { label: 'Normal', color: 'default' as const };

                      return (
                        <ListItem
                          key={file.fileID}
                          component={ListItemButton}
                          onClick={() => {
                            handleFileClick(file);
                            console.log('File clicked:', file);
                            // Handle file click - preview, download, etc.
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              type="filled"
                              color={fileTypeInfo.color as any}
                              sx={{
                                bgcolor: `${fileTypeInfo.color}.main`,
                                color: 'background.paper'
                              }}
                            >
                              {fileTypeInfo.icon}
                            </Avatar>
                          </ListItemAvatar>

                          <ListItemText
                            primary={
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                  component="span"
                                  variant="h6"
                                  sx={{
                                    fontWeight: file.mark ? 'bold' : 'normal',
                                    flex: 1
                                  }}
                                >
                                  {file.fileName || file.filePath.split('/').pop()}
                                </Typography>
                                <Chip
                                  label={fileTypeInfo.label}
                                  size="small"
                                  variant="outlined"
                                  color={fileTypeInfo.color}
                                />
                              </Stack>
                            }
                            secondary={
                              <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
                                <Stack>
                                  {/* Device and user info */}
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                      <strong><FormattedMessage id={'media device'} />:</strong> {file.puName || file.puID}
                                    </Typography>
                                    {file.userName && (
                                      <Typography variant="body2" color="text.secondary">
                                        <strong><FormattedMessage id={'media user'} />:</strong> {file.userName}
                                      </Typography>
                                    )}
                                  </Stack>

                                  {/* File details */}
                                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                    <Typography variant="body2" color="text.secondary">
                                      <strong><FormattedMessage id={'media size'} />:</strong> {formattedSize}
                                    </Typography>
                                    {file.channelIndex !== undefined && (
                                      <Typography variant="body2" color="text.secondary">
                                        <strong><FormattedMessage id={'media channel'} />:</strong> {file.channelIndex}
                                      </Typography>
                                    )}
                                    {file.className && (
                                      <Typography variant="body2" color="text.secondary">
                                        <strong><FormattedMessage id={'media class'} />:</strong> {file.className}
                                      </Typography>
                                    )}
                                  </Stack>

                                  {/* Location and description */}
                                  {(file.lat && file.lng) && (
                                    <Typography variant="body2" color="text.secondary">
                                      <strong><FormattedMessage id={'media location'} />:</strong> {file.lat.toFixed(4)}, {file.lng.toFixed(4)}
                                    </Typography>
                                  )}

                                </Stack>
                                <Stack alignItems="flex-end" spacing={0.5} sx={{ minWidth: 120 }}>
                                  <Chip
                                    label={statusInfo.label}
                                    size="small"
                                    color={statusInfo.color}
                                    variant={file.mark ? "filled" : "outlined"}
                                  />
                                  <Typography variant="caption" noWrap component="span">
                                    {formattedBeginTime}
                                  </Typography>

                                </Stack>
                              </Stack>
                            }
                            primaryTypographyProps={{ component: "div" }}
                            secondaryTypographyProps={{ component: "div" }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>

                )}

                <FileDialog
                  statusFilter={statusFilter}
                  puid={selectedDevice[0]?.id?.toString() || null}
                  open={dialogOpen}
                  file={selectedFile}
                  onClose={handleCloseDialog}
                />
              </SimpleBar>
            </CardContent>
          </MainCard>
        </ClickAwayListener>
      </Paper>
    </Box>
  );
}


// ==============================|| COMPONENT CONTENT - FILEDIALOGS ||============================== //
interface FileDialogProps {
  statusFilter: StatusFilter;
  puid: string | null;
  open: boolean;
  file: FileRecord | null;
  onClose: () => void;
}

function FileDialog({ statusFilter, puid, open, file, onClose }: FileDialogProps) {
  if (!file) return null;

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileTypeInfo = getFileTypeInfo(file.fileType);
  const formattedSize = formatFileSize(file.fileSize);
  const formattedBeginTime = formatDateTime(file.beginTime);
  const formattedInsertTime = formatDateTime(file.insertTime);

  useEffect(() => {
    if (open && file && (file.fileType === 'image' || file.fileType === 'video')) {
      console.log('Fetching media file for preview:', file);
      fetchMediaFile();
    } else {
      setMediaUrl(null);
      console.log('No media preview available for this file type or dialog closed.');
    }
  }, [open, file]);

  const fetchMediaFile = async () => {
    if (!file) return;

    setLoading(true);
    try {
      let blob: Blob;

      if (statusFilter === 'platform') {
        blob = await perviewPlatformFiles(file.fileID);
      } else if (statusFilter === 'terminal' && puid) {
        blob = await perviewTerminalFiles(puid, file.fileID);
      } else {
        throw new Error('Invalid status filter or missing puid');
      }

      // Convert blob to object URL for display
      const objectUrl = URL.createObjectURL(blob);
      setMediaUrl(objectUrl);
    } catch (error) {
      console.error('Failed to load media file:', error);
      setMediaUrl(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h5">
              {file.fileName || file.filePath.split('/').pop()}
            </Typography>
            <Chip
              label={fileTypeInfo.label}
              color={fileTypeInfo.color}
              variant="filled"
            />
            {file.mark && (
              <Chip label="Marked" color="primary" size="small" />
            )}
          </Stack>
          <IconButton size="large" color="error" onClick={onClose}>
            <CloseCircle variant="Outline" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* File Preview Area */}
          <Stack alignItems="center" sx={{ py: 2, bgcolor: 'grey.50', borderRadius: 1, minHeight: 200 }}>
            {loading ? (
              <Typography><FormattedMessage id={'media loading'} /> </Typography>
            ) : file.fileType === 'image' && mediaUrl ? (
              <img
                src={mediaUrl}
                alt={file.fileName}
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                onError={() => setMediaUrl(null)}
              />
            ) : file.fileType === 'video' && mediaUrl ? (
              <video
                controls
                style={{ maxWidth: '100%', maxHeight: 400 }}
                onError={() => setMediaUrl(null)}
              >
                <source src={mediaUrl} type={`video/${file.filePath?.split('.').pop() || 'mp4'}`} />
                <FormattedMessage id={'media not support'} />
              </video>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {file.fileType === 'image' || file.fileType === 'video'
                  ? <FormattedMessage id={'media preview area'} />
                  : <FormattedMessage id={'media preview not available'} /> }
              </Typography>
            )}
          </Stack>

          <Divider />

          {/* File Details */}
          <Stack spacing={2}>
            <Typography variant="h6"><FormattedMessage id={'media fileDetails'} /></Typography>

            <Stack direction="row" spacing={4} flexWrap="wrap">
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong><FormattedMessage id={'media fileID'} />:</strong> {file.fileID}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong><FormattedMessage id={'media size'} />:</strong> {formattedSize}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong><FormattedMessage id={'media beginTime'} />:</strong> {formattedBeginTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong><FormattedMessage id={'media insertTime'} />:</strong> {formattedInsertTime}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong><FormattedMessage id={'media device'} />:</strong> {file.puName || file.puID}
                </Typography>
                {file.userName && (
                  <Typography variant="body2" color="text.secondary">
                    <strong><FormattedMessage id={'media user'} />:</strong> {file.userName}
                  </Typography>
                )}
                {file.channelIndex !== undefined && (
                  <Typography variant="body2" color="text.secondary">
                    <strong><FormattedMessage id={'media channel'} />:</strong> {file.channelIndex}
                  </Typography>
                )}
              </Stack>
            </Stack>

            {/* Additional Information */}
            {(file.recordReason || file.className) && (
              <Stack spacing={1}>
                {file.recordReason && (
                  <Typography variant="body2" color="text.secondary">
                    <strong><FormattedMessage id={'media device'} />:</strong> {file.recordReason}
                  </Typography>
                )}
                {file.className && (
                  <Typography variant="body2" color="text.secondary">
                    <strong><FormattedMessage id={'media class'} />:</strong> {file.className}
                  </Typography>
                )}
              </Stack>
            )}

            {/* Location */}
            {(file.lat && file.lng) && (
              <Typography variant="body2" color="text.secondary">
                <strong><FormattedMessage id={'media location'} />:</strong> {file.lat.toFixed(6)}, {file.lng.toFixed(6)}
              </Typography>
            )}

            {/* Descriptions */}
            {/* {(file.desc1 || file.desc2) && (
              <Stack spacing={1}>
                {file.desc1 && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Description 1:</strong> {file.desc1}
                  </Typography>
                )}
                {file.desc2 && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Description 2:</strong> {file.desc2}
                  </Typography>
                )}
              </Stack>
            )} */}
          </Stack>
        </Stack>
      </DialogContent>

      {/* <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            // Handle download
            window.open(`/api/files/${file.fileID}/download`, '_blank');
          }}
        >
          Download
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
