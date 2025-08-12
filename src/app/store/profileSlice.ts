import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ConversionState {
  profile: string
}

const initialState: ConversionState = {
  profile: "nenhum"
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<string>) {
      state.profile = action.payload
    },
    setProfileReset(state, action: PayloadAction<string>) {
      state.profile = "nenhum"
    }
  }
})

export const {
  setProfile,
  setProfileReset
} = profileSlice.actions
export default profileSlice.reducer
