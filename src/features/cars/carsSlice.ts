import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { carsApi } from '@/services/endpoints'
import type { ApiError, Car, CarHistoryEntry, CarUpdateInput } from '@/types'

interface CarsState {
  items: Car[]
  selectedCar: Car | null
  history: CarHistoryEntry[]
  loading: boolean
  historyLoading: boolean
  updating: boolean
  error: string | null
}

const initialState: CarsState = {
  items: [],
  selectedCar: null,
  history: [],
  loading: false,
  historyLoading: false,
  updating: false,
  error: null,
}

export const fetchCars = createAsyncThunk<Car[], void, { rejectValue: ApiError }>(
  'cars/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await carsApi.getAll()
      return data
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const fetchCarById = createAsyncThunk<Car, string, { rejectValue: ApiError }>(
  'cars/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await carsApi.getById(id)
      return data
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const fetchCarHistory = createAsyncThunk<CarHistoryEntry[], string, { rejectValue: ApiError }>(
  'cars/fetchHistory',
  async (carId, { rejectWithValue }) => {
    try {
      const { data } = await carsApi.getHistory(carId)
      return data
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const updateCar = createAsyncThunk<
  Car,
  { id: string; changes: CarUpdateInput },
  { rejectValue: ApiError }
>('cars/update', async ({ id, changes }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await carsApi.update(id, changes)
    dispatch(fetchCarHistory(id))
    return data
  } catch (error) {
    return rejectWithValue(error as ApiError)
  }
})

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    clearSelectedCar: (state) => {
      state.selectedCar = null
      state.history = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message ?? 'Failed to fetch cars'
      })
      .addCase(fetchCarById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedCar = action.payload
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message ?? 'Failed to fetch car'
      })
      .addCase(fetchCarHistory.pending, (state) => {
        state.historyLoading = true
      })
      .addCase(fetchCarHistory.fulfilled, (state, action) => {
        state.historyLoading = false
        state.history = action.payload
      })
      .addCase(fetchCarHistory.rejected, (state, action) => {
        state.historyLoading = false
        state.error = action.payload?.message ?? 'Failed to fetch car history'
      })
      .addCase(updateCar.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.updating = false
        state.selectedCar = action.payload
        state.items = state.items.map((car) => (car.id === action.payload.id ? action.payload : car))
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload?.message ?? 'Failed to update car'
      })
  },
})

export const { clearSelectedCar } = carsSlice.actions
export default carsSlice.reducer
