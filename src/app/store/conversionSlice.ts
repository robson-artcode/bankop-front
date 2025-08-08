import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ConversionState {
  opCoinsToConvert: number
  opCoins: number
  brlCoins: number
}

const initialState: ConversionState = {
  opCoinsToConvert: 0,
  opCoins: 0,
  brlCoins: 0
}

const conversionSlice = createSlice({
  name: 'conversion',
  initialState,
  reducers: {
    setOpCoinsToConvert(state, action: PayloadAction<number>) {
      state.opCoinsToConvert = action.payload
    }, 
    setOpCoins(state, action: PayloadAction<number>) {
      state.opCoins = action.payload
    },
    setBrlCoins(state, action: PayloadAction<number>) {
      state.brlCoins = action.payload
    },
    resetOpCoinsToConvert(state) {
      state.opCoinsToConvert = 0
    }
  }
})

export const { 
  setOpCoinsToConvert,
  setOpCoins,
  setBrlCoins,
  resetOpCoinsToConvert
} = conversionSlice.actions
export default conversionSlice.reducer
