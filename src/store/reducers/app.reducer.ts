import {createSlice} from '@reduxjs/toolkit';
import {storeData} from '../../services/asyncStorage';

const appSlice = createSlice({
  name: 'appState',
  initialState: {
    leadboardScores: <any[]>[],
    name: <string>'',
    msDelay: <number>500,
  },
  reducers: {
    setNewScore(state, action) {
      state.leadboardScores.push(action.payload);
      storeData('scores', state.leadboardScores);
    },
    setScoresFromAsyncStorage(state, action) {
      state.leadboardScores = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setMsDelay(state, action) {
      state.msDelay = action.payload;
    },
  },
});

export const {setNewScore, setName, setMsDelay, setScoresFromAsyncStorage} =
  appSlice.actions;
export default appSlice.reducer;
