import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { PuPlayer } from '@besovideo/webrtc-player';
import "@besovideo/webrtc-player/dist/main.es.css";

// components
import DeviceList from 'components/development/DeviceList';

// assets
import { Microphone2, MicrophoneSlash} from 'iconsax-reactjs';

// Types
import { Device } from 'types/development/devices';
import { Box, CardContent, ClickAwayListener, Link, Paper, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';
import { Container, padding, Stack } from '@mui/system';

// Get Auth
import useAuth from 'hooks/useAuth';
import { FormattedMessage } from 'react-intl';

// Define types for the player instance
interface PuPlayerInstance {
  destroy: () => void;
  open: () => Promise<void>;
  close: () => void;
  setVideoFit: (fit: string) => void;
  display: () => void;
  hidden: () => void;
  moveTo: (container: HTMLElement | null) => void;
}

interface DeviceListItem {
  id: string;
  channels: number[];
}

interface PlayerState {
  instance: PuPlayerInstance | null;
  isClosed: boolean;
  isHidden: boolean;
  selectedDevice: string;
  selectedChannel: number;
  videoFit: 'contain' | 'fill';
}

const PlayBackPage: React.FC = () => {
  // Refs for DOM elements - fixed 4 containers
  const playerContainerRefs = useRef([
    React.createRef<HTMLDivElement>(),
    React.createRef<HTMLDivElement>(),
    React.createRef<HTMLDivElement>(),
    React.createRef<HTMLDivElement>()
  ]);
  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  // State variables with proper types
  const [deviceList, setDeviceList] = useState<Device[]>([]);

  // Individual player states for each container
  const [players, setPlayers] = useState<PlayerState[]>([
    { instance: null, isClosed: true, isHidden: false, selectedDevice: '', selectedChannel: 0, videoFit: 'fill' },
    { instance: null, isClosed: true, isHidden: false, selectedDevice: '', selectedChannel: 0, videoFit: 'fill' },
    { instance: null, isClosed: true, isHidden: false, selectedDevice: '', selectedChannel: 0, videoFit: 'fill' },
    { instance: null, isClosed: true, isHidden: false, selectedDevice: '', selectedChannel: 0, videoFit: 'fill' }
  ]);

  const [availableChannels, setAvailableChannels] = useState<number[]>([]);
  const [messages, setMessages] = useState<string[]>([]);

  const { token } = useAuth();


  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // Add message to log
  const addMessage = (message: string): void => {
    setMessages(prev => [...prev, message]);
  };

  // Handle device select and init the player
  const handleDeviceSelect = (newSelectedDevices: Device[]) => {
    // Find devices that were added (in new but not in current deviceList)
    const addedDevices = newSelectedDevices.filter(
      newDevice => !deviceList.some(currentDevice => currentDevice.id === newDevice.id)
    );

    // Find devices that were removed (in current deviceList but not in new)
    const removedDevices = deviceList.filter(
      currentDevice => !newSelectedDevices.some(newDevice => newDevice.id === currentDevice.id)
    );
    
    console.log("Players status:",JSON.stringify(players));
    // Log the changes
    if (addedDevices.length > 0) {
      console.log("➕ ADDED devices:", addedDevices.map(d => ({ id: d.id, name: d.name })));

      // Find available players for new devices
      addedDevices.forEach(device => {
        const availablePlayerIndex = players.findIndex(player => 
          player.isClosed || player.selectedDevice === ''
        );
        
        if (availablePlayerIndex !== -1) {
          console.log(`🎯 Assigning device "${device.name}" to player ${availablePlayerIndex}`);

          initPlayer(availablePlayerIndex, device);
        } else {
          console.log(`❌ No available players for device "${device.name}"`);
        }
      });
    }

    if (removedDevices.length > 0) {
      console.log("➖ REMOVED devices:", removedDevices.map(d => ({ id: d.id, name: d.name })));
      
      // Find and reset players that were using removed devices
      removedDevices.forEach(device => {
        const playerIndex = players.findIndex(player => 
          player.selectedDevice === device.id
        );
        
        if (playerIndex !== -1) {
          console.log(`🗑️ Resetting player ${playerIndex} (was using "${device.name}")`);
          closeConnection(playerIndex);
          // Reset the player
          destroyPlayer(playerIndex);
        }
      });
    }

    // Update the state with the new selection
    setDeviceList(newSelectedDevices);
  };

  // Initialize player for specific container
  const initPlayer = async(playerIndex: number, device: Device): Promise<void> => {
    const playerState = players[playerIndex];

    console.log("This is player state", JSON.stringify(playerState));
    if (!token || !device.id) {
      addMessage(`Player ${playerIndex + 1}: No device selected or token missing`);
      return;
    }

    console.log(`Initializing player ${playerIndex + 1} with device:`, device.id, 'channel:', device.channels[0].index) ?? 0;
    
    const { instance } = PuPlayer({
      container: playerContainerRefs.current[playerIndex].current,
      puOption: {
        id: device.id,
        index: 0,
      },
      token: token ?? '',
      videoFit: playerState.videoFit,
      fullScreenOnDblclick: true,
      enableController: true,
      onConnected: () => {
        addMessage(`Player ${playerIndex + 1}: onConnected`);
      },
      onConnectedFailed: () => {
        addMessage(`Player ${playerIndex + 1}: onConnectedFailed`);
      },
      onClose: () => {
        addMessage(`Player ${playerIndex + 1}: onClose`);
      },
      onDisConnected: () => {
        addMessage(`Player ${playerIndex + 1}: onDisConnected`);
      },
      onDestroy: () => {
        addMessage(`Player ${playerIndex + 1}: onDestroy`);
      },
    });

    if (!instance) return;
    try {
      await instance.open();
      
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        isClosed: false
      };
      setPlayers(updatedPlayers);
    } catch (error) {
      console.error(`Failed to open connection for player ${playerIndex + 1}:`, error);
    }

    // Update specific player state
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      selectedDevice: device.id,
      selectedChannel: device.channels[0].index ?? 0,
      isClosed: false,
      instance: instance as PuPlayerInstance
    };
    setPlayers(updatedPlayers);
  };

  // Destroy player for specific container
  const destroyPlayer = (playerIndex: number): void => {
    const playerState = players[playerIndex];
    if (playerState.instance) {
      playerState.instance.destroy();
      
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        instance: null,
        isClosed: true
      };
      setPlayers(updatedPlayers);
    }
  };

  // Open connection for specific player
  const openConnection = async (playerIndex: number): Promise<void> => {
    const playerState = players[playerIndex];
    if (!playerState.instance) return;
    
    try {
      await playerState.instance.open();
      
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        isClosed: false
      };
      setPlayers(updatedPlayers);
    } catch (error) {
      console.error(`Failed to open connection for player ${playerIndex + 1}:`, error);
    }
  };

  // Close connection for specific player
  const closeConnection = (playerIndex: number): void => {
    const playerState = players[playerIndex];
    if (playerState.instance) {
      playerState.instance.close();
      
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        isClosed: true
      };
      setPlayers(updatedPlayers);
    }
  };

  // Change video fit for specific player
  const handleVideoFitChange = (playerIndex: number, e: ChangeEvent<HTMLSelectElement>): void => {
    const newVideoFit = e.target.value as 'contain' | 'fill';
    const playerState = players[playerIndex];
    
    if (playerState.instance) {
      playerState.instance.setVideoFit(newVideoFit);
      
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        videoFit: newVideoFit
      };
      setPlayers(updatedPlayers);
    }
  };

  // Show player for specific container
  const showPlayer = (playerIndex: number): void => {
    const playerState = players[playerIndex];
    if (playerState.instance) {
      playerState.instance.display();
      
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        isHidden: false
      };
      setPlayers(updatedPlayers);
    }
  };

  // Hide player for specific container
  const hidePlayer = (playerIndex: number): void => {
    const playerState = players[playerIndex];
    if (playerState.instance) {
      playerState.instance.hidden();
      
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        isHidden: true
      };
      setPlayers(updatedPlayers);
    }
  };

  // Handle device selection for specific player
  const handleDeviceChange = (playerIndex: number, e: ChangeEvent<HTMLSelectElement>): void => {
    const deviceId = e.target.value;
    
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      selectedDevice: deviceId
    };
    setPlayers(updatedPlayers);
    
    // Update available channels for selected device
    const device = deviceList.find(item => item.id === deviceId);
    const channels = device ? device.channels : [];
    const channelIndexes = Array.isArray(channels) && channels.length > 0 && typeof channels[0] === 'object'
      ? channels.map((ch: any) => ch.index)
      : channels;
    setAvailableChannels(channelIndexes);
  };

  // Handle channel selection for specific player
  const handleChannelChange = (playerIndex: number, e: ChangeEvent<HTMLSelectElement>): void => {
    const channel = Number(e.target.value);
    
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      selectedChannel: channel
    };
    setPlayers(updatedPlayers);
  };

  // Clear messages
  const clearMessages = (): void => {
    setMessages([]);
  };

  // Initialize all players
  const initAllPlayers = (): void => {
    players.forEach((_, index) => {
      if (players[index].selectedDevice) {
        // initPlayer(index);
      }
    });
  };

  // Destroy all players
  const destroyAllPlayers = (): void => {
    players.forEach((_, index) => {
      destroyPlayer(index);
    });
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'row',
      alignItems: 'top',
      justifyContent: 'left', gap: 2, flexShrink: 0, ml: 0.5
    }}>
      <DeviceList selectionMode='multiple' onDevicesSelected={(devices) => handleDeviceSelect(devices)}/>
      <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, borderRadius: 1.5, width: '55vw' })}>
        <ClickAwayListener onClickAway={handleClose}>
          <MainCard border={false} content={false}>
            <CardContent>
              {/* Updated Header with Pagination Controls */}
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">
                  <FormattedMessage id={'live title'} />
                </Typography>
              </Stack>
        
        {/* Video Grid with 4 fixed containers */}
        <Grid container spacing={0.5} sx={{ p: 0, height: '78vh' }}>
          {players.map((player, index) => (
            <Grid size={{xs: 6}} key={index} sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '50%'
            }}>
                <Container 
                  ref={playerContainerRefs.current[index]} 
                  sx={{ 
                    height: '100%', 
                    width: '100%', 
                    border: '1px solid #ccc', 
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    borderRadius: 1,
                    padding: '0 !important'
                  }}
                >
                </Container>
            </Grid>
          ))}
        </Grid>
              </CardContent>
            </MainCard>
          </ClickAwayListener>
      </Paper>
    </Box>
  );
};


export default PlayBackPage;