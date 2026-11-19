import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { dataSource } from '@/services/endpoints'
import type { UserRole } from '@/types'

const ROLE_STORAGE_KEY = 'carcycle-role'

// In firestore mode only the Firebase session (watchAdmin in main.tsx) can make someone admin.
const getStoredRole = (): UserRole =>
  dataSource !== 'firestore' && localStorage.getItem(ROLE_STORAGE_KEY) === 'admin' ? 'admin' : 'user'

interface AuthState {
  role: UserRole
}

const initialState: AuthState = {
  role: getStoredRole(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload
      localStorage.setItem(ROLE_STORAGE_KEY, action.payload)
    },
  },
})

export const { setRole } = authSlice.actions
export default authSlice.reducer
