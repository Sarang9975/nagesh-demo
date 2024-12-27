// app/src/store/voice/call/transcription.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TranscriptionState {
  [callId: string]: {
    transcript: string;
    isDeafMode: boolean;
    detectedLanguage: string;
    currentLanguage: string;
  };
}

const initialState: TranscriptionState = {};

export const transcriptionSlice = createSlice({
  name: 'transcription',
  initialState,
  reducers: {
    updateTranscription(state, action: PayloadAction<{
      id: string, 
      transcript: string,
      detectedLanguage?: string
    }>) {
      const { id, transcript, detectedLanguage } = action.payload;
      if (!state[id]) {
        state[id] = {
          transcript: '',
          isDeafMode: true,
          detectedLanguage: detectedLanguage || '',
          currentLanguage: 'hi-IN'
        };
      }
      state[id].transcript += transcript + '\n';
      if (detectedLanguage) {
        state[id].detectedLanguage = detectedLanguage;
      }
    }
  }
});

export const { updateTranscription } = transcriptionSlice.actions;
export default transcriptionSlice.reducer;