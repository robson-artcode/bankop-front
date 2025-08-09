// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import conversionReducer from './conversionSlice'
import transactionReducer from './transactionSlice'

export const store = configureStore({
  reducer: {
    conversion: conversionReducer,
    transaction: transactionReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
