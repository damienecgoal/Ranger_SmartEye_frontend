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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Avatar from 'components/@extended/Avatar';
// assets
import { SearchNormal1, Notification, Refresh, Trash } from 'iconsax-reactjs';
import SimpleBar from 'simplebar-react';
import MainCard from 'components/MainCard';
import { IconButton, SxProps, Theme } from '@mui/material';

//type
import { Device } from 'types/development/devices';
import { FormattedMessage, useIntl } from 'react-intl';

// ==============================|| FILTER TYPES ||============================== //

type StatusFilter = 'all' | 'online' | 'offline';
type SelectionMode = 'single' | 'multiple';

// types
// interface Device {
//     id: string;
//     gid: string;
//     name: string;
//     classID: number;
//     status: number; // 0 = offline, 1 = online
//     channels: Array<{
//         index: number;
//         mediaDir: number;
//         ptz: number;
//         name: string;
//     }>;
//     gps: {
//         lng: number;
//         lat: number;
//         time: number;
//     };
//     lastTime: number;
// }

// ==============================|| DEVICE LIST COMPONENT PROPS ||============================== //

interface DeviceListProps {
    sx?: SxProps<Theme>;
    onDevicesSelected?: (selectedDevices: Device[]) => void;
    selectionMode?: SelectionMode; // ✅ NEW: Control selection behavior
    defaultSelectionMode?: SelectionMode; // ✅ NEW: Default mode
}

// ==============================|| DEVICE LIST WITH FILTERS ||============================== //

export default function DeviceList({
    sx = {},
    onDevicesSelected,
    selectionMode = 'multiple', // ✅ NEW: Default to multiple selection
    defaultSelectionMode = 'multiple' // ✅ NEW: Default mode
}: DeviceListProps) {
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const intl = useIntl();
    const anchorRef = useRef<any>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    // ✅ UPDATED: Selection states
    const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
    const [currentSelectionMode, setCurrentSelectionMode] = useState<SelectionMode>(selectionMode);

    // ✅ Handle device selection based on mode
    const handleDeviceSelect = (deviceId: Device) => {
        if (currentSelectionMode === 'single') {
            // Single selection: toggle the clicked device
            setSelectedDevices(prev =>
                prev.includes(deviceId) ? [] : [deviceId] // Clear all and select only this one
            );
        } else {
            // Multiple selection: add/remove from selection
            setSelectedDevices(prev =>
                prev.includes(deviceId)
                    ? prev.filter(id => id !== deviceId) // Remove if already selected
                    : [...prev, deviceId] // Add to selection
            );
        }
    };

    // ✅ Clear all selections
    const handleClearSelection = () => {
        setSelectedDevices([]);
    };

    // ✅ Handle selection mode change
    const handleSelectionModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMode: SelectionMode = event.target.checked ? 'multiple' : 'single';
        setCurrentSelectionMode(newMode);

        // If switching from multiple to single and multiple devices are selected,
        // keep only the first selected device
        if (newMode === 'single' && selectedDevices.length > 1) {
            setSelectedDevices([selectedDevices[0]]);
        }
    };

    // Expose selected devices to parent
    useEffect(() => {
        onDevicesSelected?.(selectedDevices);
    }, [selectedDevices, onDevicesSelected]);

    // Sync with external selectionMode prop changes
    useEffect(() => {
        setCurrentSelectionMode(selectionMode);

        // Adjust selection when mode changes externally
        if (selectionMode === 'single' && selectedDevices.length > 1) {
            setSelectedDevices([selectedDevices[0]]);
        }
    }, [selectionMode]);

    // Fetch devices when component mounts
    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/bvcsp/v1/pu/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('serviceToken') || ''
                },
                body: JSON.stringify({
                    page: 0,
                    pageSize: 10
                })
            });

            if (!response.ok) throw new Error('Failed to fetch devices');
            const deviceData = await response.json();
            setDevices(deviceData.data || []);
        } catch (error) {
            console.error('Error fetching devices:', error);
            setDevices([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtered devices function
    const getFilteredDevices = () => {
        return devices.filter(device => {
            // Search filter (name or ID)
            const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                device.id.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'online' && device.status === 1) ||
                (statusFilter === 'offline' && device.status === 0);

            return matchesSearch && matchesStatus;
        });
    };

    const filteredDevices = getFilteredDevices();

    // Get counts for filter badges
    const onlineCount = devices.filter(device => device.status === 1).length;
    const offlineCount = devices.filter(device => device.status === 0).length;
    const filteredCount = filteredDevices.length;

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) return;
        setOpen(false);
    };

    // Handle filter changes
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleStatusFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: StatusFilter) => {
        if (newFilter !== null) {
            setStatusFilter(newFilter);
        }
    };

    const formatLastSeen = (timestamp: number) => {
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
        <Box sx={[{ flexShrink: 0, ml: 0.5 }, ...(Array.isArray(sx) ? sx : [sx])]}>
            <Paper
                sx={[
                    (theme) => ({
                        boxShadow: theme.customShadows.z1,
                        borderRadius: 1.5,
                    }),
                    { width: { xs: 300, sm: 380 } },
                ]}
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <MainCard border={false} content={false}>
                        <CardContent>
                            {/* Header with Title and Refresh */}
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h5"><FormattedMessage id={'devices title'} /></Typography>
                                <IconButton size="large" color="primary" onClick={fetchDevices}>
                                    <Refresh variant="Outline" />
                                </IconButton>
                            </Stack>

                            {/* ✅ UPDATED: Selection Mode Toggle */}
                            {/* <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Selection Mode:
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="caption" color={currentSelectionMode === 'single' ? 'primary' : 'text.secondary'}>
                                        Single
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={currentSelectionMode === 'multiple'}
                                                onChange={handleSelectionModeChange}
                                                size="small"
                                                color="primary"
                                            />
                                        }
                                        label=""
                                    />
                                    <Typography variant="caption" color={currentSelectionMode === 'multiple' ? 'primary' : 'text.secondary'}>
                                        Multiple
                                    </Typography>
                                </Stack>
                            </Stack> */}

                            {/* ✅ NEW: Selection Status */}
                            {selectedDevices.length > 0 && (
                                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="primary">
                                        {currentSelectionMode === 'single'
                                            ? <FormattedMessage id={'devices single selected'} />
                                            : <>{selectedDevices.length} <FormattedMessage id={'devices multiple selected'} /></>
                                        }
                                    </Typography>
                                    <IconButton size="small" color="error" onClick={handleClearSelection}>
                                        <Trash variant="Outline" />
                                    </IconButton>
                                </Stack>
                            )}

                            {/* Search and Filter Controls */}
                            <Stack spacing={2} sx={{ mb: 1 }}>
                                {/* Search Input */}
                                <TextField
                                    fullWidth
                                    placeholder={intl.formatMessage({ id: 'devices search placeholder' })}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchNormal1 size={20} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                />

                                {/* Status Filter Toggle */}
                                <ToggleButtonGroup
                                    color="primary"
                                    value={statusFilter}
                                    exclusive
                                    onChange={handleStatusFilterChange}
                                    aria-label="device status filter"
                                    fullWidth
                                    size="small"
                                >
                                    <ToggleButton value="all" aria-label="all devices">
                                        <FormattedMessage id={'all'} /> ({devices.length})
                                    </ToggleButton>
                                    <ToggleButton value="online" aria-label="online devices">
                                        <FormattedMessage id={'online'} /> ({onlineCount})
                                    </ToggleButton>
                                    <ToggleButton value="offline" aria-label="offline devices">
                                        <FormattedMessage id={'offline'} /> ({offlineCount})
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                {/* Results Count */}

                            </Stack>

                            <SimpleBar style={{ maxHeight: 'calc(100vh - 320px)' }}>
                                {loading ? (
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <FormattedMessage id={'devices loading'} />
                                        </Typography>
                                    </Box>
                                ) : !devices || devices.length === 0 ? (
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <FormattedMessage id={'devices not found'} />
                                        </Typography>
                                    </Box>
                                ) : filteredDevices.length === 0 ? (
                                    // No results message
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <FormattedMessage id={'devices no filter'} />
                                        </Typography>
                                        {(searchTerm || statusFilter !== 'all') && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                <FormattedMessage id={'devices adjust search'} />
                                            </Typography>
                                        )}
                                    </Box>
                                ) : (
                                    <List>
                                        {filteredDevices.map((device) => (
                                            <ListItem key={device.id} disablePadding divider>
                                                <ListItemButton
                                                    onClick={() => handleDeviceSelect(device)}
                                                    sx={{
                                                        bgcolor: selectedDevices.includes(device)
                                                            ? 'primary.lighter'
                                                            : 'transparent',
                                                        borderColor: selectedDevices.includes(device)
                                                            ? 'primary.light'
                                                            : 'transparent',
                                                        borderWidth: 1,
                                                        borderStyle: 'solid',
                                                        '&:hover': {
                                                            bgcolor: selectedDevices.includes(device)
                                                                ? 'primary.lighter'
                                                                : 'action.hover',
                                                            borderColor: selectedDevices.includes(device)
                                                                ? 'primary.light'
                                                                : 'divider',
                                                        }
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Badge
                                                            color={device.status === 1 ? "success" : "error"}
                                                            variant="dot"
                                                            anchorOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'left'
                                                            }}
                                                        >
                                                            <Avatar
                                                                alt={device.name}
                                                                color={device.status === 1 ? "success" : "secondary"}
                                                                size="sm"
                                                            >
                                                                <Notification variant="Bold" />
                                                            </Avatar>
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <Typography variant="subtitle1" noWrap>
                                                                    {device.name}
                                                                </Typography>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <Chip
                                                                        label={device.status === 1 ? <FormattedMessage id={'online'} /> : <FormattedMessage id={'offline'} />}
                                                                        color={device.status === 1 ? "success" : "default"}
                                                                        size="small"
                                                                        variant="filled"
                                                                    />
                                                                    {/* ✅ NEW: Selection Indicator */}
                                                                    {selectedDevices.includes(device) && (
                                                                        <Box
                                                                            sx={{
                                                                                width: 8,
                                                                                height: 8,
                                                                                borderRadius: '50%',
                                                                                bgcolor: 'primary.main',
                                                                                ml: 0.5
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            </Stack>
                                                        }
                                                        secondary={
                                                            <Stack spacing={0.5}>
                                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                                    <FormattedMessage id={'id'} />: {device.id}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    <FormattedMessage id={'last online'} />: {formatLastSeen(device.lastTime)}
                                                                </Typography>
                                                                <Stack direction="row" spacing={1}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        <FormattedMessage id={'gps'} />: {device.gps.lat.toFixed(6)}, {device.gps.lng.toFixed(6)}
                                                                    </Typography>
                                                                </Stack>
                                                            </Stack>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>

                                )}
                            </SimpleBar>
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                                    <FormattedMessage id={'pagnation showing'} /> {filteredCount} <FormattedMessage id={'pagnation of'} /> {devices.length}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </MainCard>
                </ClickAwayListener>
            </Paper>
        </Box>
    );
}
