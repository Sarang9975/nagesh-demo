// app/src/store/voice/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import { accessTokenSlice } from './accessToken';
import { audioDevicesSlice } from './audioDevices';
import { activeCallSlice } from './call/activeCall';
import { callInviteSlice } from './call/callInvite';
import { registrationSlice } from './registration';
import { transcriptionSlice } from './call/transcription';

export const voiceReducer = combineReducers({
  [accessTokenSlice.name]: accessTokenSlice.reducer,
  [audioDevicesSlice.name]: audioDevicesSlice.reducer,
  call: combineReducers({
    [activeCallSlice.name]: activeCallSlice.reducer,
    [callInviteSlice.name]: callInviteSlice.reducer,
    [transcriptionSlice.name]: transcriptionSlice.reducer,
  }),
  [registrationSlice.name]: registrationSlice.reducer,
});