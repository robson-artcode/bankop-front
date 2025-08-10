import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ConversionState {
  opCoins: number
  brlCoins: number
}

const initialState: ConversionState = {
  opCoins: 0,
  brlCoins: 0
}

const conversionSlice = createSlice({
  name: 'conversion',
  initialState,
  reducers: {
    setOpCoins(state, action: PayloadAction<number>) {
      state.opCoins = action.payload
    },
    setBrlCoins(state, action: PayloadAction<number>) {
      state.brlCoins = action.payload
    }
  }
})

export const {
  setOpCoins,
  setBrlCoins
} = conversionSlice.actions
export default conversionSlice.reducer
