import { configureStore } from '@reduxjs/toolkit'
import carsReducer from '@/features/cars/carsSlice'
import uiReducer from '@/features/ui/uiSlice'
import authReducer from '@/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    ui: uiReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
