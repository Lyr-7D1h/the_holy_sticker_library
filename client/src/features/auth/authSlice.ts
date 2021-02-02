import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { send } from '../socket/Socket'

const slice = createSlice({
  name: 'auth',
  initialState: {
    isAdmin: false,
  },
  reducers: {
    authenticate(state, action) {
      return
    },
  },
})

export const { authenticate } = slice.actions

export default slice.reducer
