import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface transactionTypeObject {
  id: string
  type: string
  description: string
}
interface transactionCoinObject {
  id: string
  symbol: string
  name: string
}
interface transactionUserObject {
  id: string
  email: string
  name: string
}
interface transactionType {
    id: string
    fromCoin: transactionCoinObject
    toCoin: transactionCoinObject
    amountFrom: number
    amountTo: number
    userId: string
    userFrom: transactionUserObject
    userTo: transactionUserObject
    type: transactionTypeObject
    createdAt: string
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
    setNewTransactions(state, action: PayloadAction<transactionType[]>) {
      state.transactions = [...action.payload, ...state.transactions];
    },
    setTransactions(state, action: PayloadAction<transactionType[]>) {
      state.transactions = action.payload;
    },
    resetTransactions(state) {
      state.transactions = []
    }
  }
})

export const { 
  setNewTransactions,
  setTransactions,
  resetTransactions
} = transactionSlice.actions
export default transactionSlice.reducer
