// app/src/screens/Transcription/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useActiveCall } from '../../hooks/activeCall';
import { useDispatch, useSelector } from 'react-redux';
import { updateTranscription } from '../../store/voice/call/transcription';
import type { State } from '../../store';


const TranscriptionScreen = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState<string>('');
  const activeCall = useActiveCall();
  const dispatch = useDispatch();

  const transcription = useSelector((state: State) =>
    state.voice.call.transcription[activeCall?.id || '']?.transcript || ''
  );

  useEffect(() => {
    if (activeCall?.info?.state === 'connected') {
      const wsUrl = __DEV__
        ? `wss://26a5-223-185-40-95.ngrok-free.app/transcription` // Use ngrok URL
        : `wss://26a5-223-185-40-95.ngrok-free.app/transcription`;
  
      let reconnectAttempts = 0;
      const maxReconnectAttempts = 5;
  
      const connectWebSocket = () => {
        try {
          const ws = new WebSocket(wsUrl);
  
          ws.onopen = () => {
            console.log('WebSocket Connected');
            setConnectionError('');
            setSocket(ws);
          };
  
          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.transcript) {
                dispatch(updateTranscription({
                  id: activeCall.id,
                  transcript: data.transcript,
                }));
              }
              if (data.error) {
                setConnectionError(data.error);
              }
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          };
  
          ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setConnectionError('Connection error occurred');
          };
  
          ws.onclose = () => {
            console.log('WebSocket Closed');
            if (reconnectAttempts < maxReconnectAttempts) {
              reconnectAttempts++;
              console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})`);
              setTimeout(connectWebSocket, 2000); // Retry after 2 seconds
            }
          };
  
          return ws;
        } catch (error) {
          console.error('WebSocket connection error:', error);
          setConnectionError('Failed to connect to transcription service');
          return null;
        }
      };
  
      const ws = connectWebSocket();
  
      return () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [activeCall?.info?.state, activeCall?.id, dispatch]);
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Transcription</Text>
      {connectionError ? (
        <Text style={styles.errorText}>{connectionError}</Text>
      ) : (
        <ScrollView
          style={styles.transcriptionContainer}
          contentContainerStyle={styles.transcriptionContent}
        >
          {transcription.split('\n').map((line, index) => (
            <Text
              key={index}
              style={[
                styles.transcriptionText,
                index === transcription.split('\n').length - 1 &&
                  styles.latestTranscription,
              ]}
            >
              {line}
            </Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  transcriptionContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  transcriptionContent: {
    flexGrow: 1,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
  },
  latestTranscription: {
    color: '#000',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TranscriptionScreen;
