// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import conversionReducer from './conversionSlice'

export const store = configureStore({
  reducer: {
    conversion: conversionReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
