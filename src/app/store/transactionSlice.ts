import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface transactionType {
    id: string
    fromCoinId: string,
    toCoinId: string,
    amountFrom: number
    amountTo: number
    createdAt: Date
}

interface ConversionState {
  transactions: transactionType[]
}

const initialState: ConversionState = {
    transactions: [] as transactionType[]
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<transactionType[]>) {
      state.transactions = [...action.payload, ...state.transactions];
    },
    resetTransactions(state) {
      state.transactions = []
    }
  }
})

export const { 
  setTransactions,
  resetTransactions
} = transactionSlice.actions
export default transactionSlice.reducer
