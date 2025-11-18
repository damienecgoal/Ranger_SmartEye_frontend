// contexts/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import useAuth from 'hooks/useAuth';


import { openSnackbar } from 'api/snackbar';
// third-party
import { enqueueSnackbar, useSnackbar, SnackbarContent, SnackbarKey, SnackbarMessage } from 'notistack';

// types
import { SnackbarProps } from 'types/snackbar';
import { Any } from 'currency.js';
import { Box, Button, Card, CardActions, CardContent, Chip, Collapse, IconButton, Paper, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { ALARM_SEVERITY } from 'types/development/alarm';
import { Add, ArrowDown2, Setting2, TickCircle } from 'iconsax-reactjs';
import { styled } from '@mui/material/styles';

interface WebSocketContextType {
  sendMessage: (message: any) => void;
  isConnected: boolean;
  lastMessage: any;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

 const SnackbarBox = styled(SnackbarContent)({
  '@media (min-width:600px)': {
    minWidth: '344px !important'
  }
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const { isLoggedIn, isInitialized, user, token, tokenExpiry, timeout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Don't connect if no token
    // if (!token) {
    //   console.log('WebSocket: No token available, cannot connect');
    //   return;
    // }

    // Don't connect if already connected or connecting
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket: Already connected or connecting');
      return;
    }

    try {
      // Close existing connection if any
      if (ws.current) {
        ws.current.close();
      }

      // Use the token from auth context, not localStorage
      const wsUrl = `ws://127.0.0.1:9780/bvcsp/v1/ws/event/alarm?token=${localStorage.getItem('serviceToken') || ''}`;
      console.log('WebSocket: Connecting to', wsUrl);
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket: Connected successfully');
        setIsConnected(true);
        setRetryCount(0); // Reset retry count on successful connection
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('WebSocket: Error parsing message', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket: Disconnected', event.code, event.reason);
        setIsConnected(false);
        ws.current = null;

        // Auto-reconnect if logged in and it wasn't a normal closure
        if (isLoggedIn && token && event.code !== 1000) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
          console.log(`WebSocket: Will attempt reconnect in ${delay}ms`);
          
          // Clear any existing timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connect();
          }, delay);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket: Connection error', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('WebSocket: Connection failed', error);
      setIsConnected(false);
    }
  }, [isLoggedIn, retryCount]);

  const disconnect = useCallback(() => {
    console.log('WebSocket: Manual disconnect');
    
    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect'); // Normal closure
      ws.current = null;
    }
    setIsConnected(false);
    setRetryCount(0);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log('WebSocket: Message sent', message);
    } else {
      console.warn('WebSocket: Cannot send message - not connected');
      // Optionally queue messages for when connection is restored
    }
  }, []);



// ==============================|| NOTISTACK - CUSTOM ||============================== //

function CustomNotistack({ id, message, ref }: any) {
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState<boolean>(false);
  const severityInfo = ALARM_SEVERITY[message.type] || { label: 'Unknown', color: 'default', icon: Setting2 };
   const IconComponent = severityInfo.icon;

  const handleExpandClick = useCallback(() => {
    setExpanded((prevState: boolean) => !prevState);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar();
  }, [id, closeSnackbar]);

  return (
    <SnackbarBox ref={ref}>
      <Card sx={{ bgcolor: `${severityInfo.color}.light`, width: '100%' }}>
        <CardActions sx={{ padding: '8px 8px 8px 16px', justifyContent: 'space-between', bgcolor:  `${severityInfo.color}.light` }}>
          <IconComponent size={20} variant="Bold" />
          <Typography variant="subtitle2">{message.desc}</Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            {/* <IconButton
              aria-label="Show more"
              sx={{ p: 1, transition: 'all .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              onClick={handleExpandClick}
            >
              <ArrowDown2 />
            </IconButton> */}
            <IconButton sx={{ p: 1, transition: 'all .2s' }} onClick={handleDismiss}>
              <Add style={{ transform: 'rotate(45deg)' }} />
            </IconButton>
          </Box>
        </CardActions>
        {/* <Collapse in={expanded} timeout="auto" unmountOnExit> */}
          <Paper sx={{ padding: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0, bgcolor:  `${severityInfo.color}.lighter` }}>
            <Typography gutterBottom>{message.devName} </Typography>
            <Typography gutterBottom>{message.devID} </Typography>
          </Paper>
        {/* </Collapse> */}
      </Card>
    </SnackbarBox>
  );
}


  const handleWebSocketMessage = useCallback((message: any) => {
    console.log('WebSocket: Message received', message);

          enqueueSnackbar("You're report is ready", {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            },
            content: <CustomNotistack id={message.key} message={message} />
          });
  }, [sendMessage, disconnect]);

  // Auto-connect when user logs in and token is available
  useEffect(() => {
    console.log('WebSocket: Auth state changed', { 
      isInitialized, 
      isLoggedIn, 
      user,
      token,
      tokenExpiry, 
      timeout,
      currentState: ws.current?.readyState 
    });
    
    if (isInitialized && isLoggedIn) {
      console.log('WebSocket: User authenticated, connecting...');
      // Small delay to ensure auth is fully settled
      const timeoutId = setTimeout(() => {
        connect();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else if (isInitialized && !isLoggedIn) {
      console.log('WebSocket: User not logged in, disconnecting...');
      disconnect();
    }
  }, [isInitialized, isLoggedIn, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [disconnect]);

  const value = {
    sendMessage,
    isConnected,
    lastMessage,
    connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
