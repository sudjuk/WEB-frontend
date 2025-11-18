import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import daysReducer from './slices/daysSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    days: daysReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


