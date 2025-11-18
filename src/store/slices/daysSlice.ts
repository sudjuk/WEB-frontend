import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Day } from '../../api/servicesApi';

interface DaysState {
  items: Day[];
  loading: boolean;
  error: string | null;
}

const initialState: DaysState = {
  items: [],
  loading: false,
  error: null,
};

const daysSlice = createSlice({
  name: 'days',
  initialState,
  reducers: {
    setDays: (state, action: PayloadAction<Day[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addDay: (state, action: PayloadAction<Day>) => {
      const exists = state.items.find(d => d.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setDays, setLoading, setError, addDay } = daysSlice.actions;
export default daysSlice.reducer;


