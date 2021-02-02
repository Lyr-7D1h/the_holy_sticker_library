import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthenticateRequestParams, AuthenticateRequest } from '@shared/auth'
import { send } from '../socket/Socket'

const slice = createSlice({
  name: 'auth',
  initialState: {
    isAdmin: false,
  },
  reducers: {
    request(state, action: PayloadAction<AuthenticateRequestParams>) {
      send(new AuthenticateRequest(action.payload))
    },
    response(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload
    },
  },
})

export const { request: authenticateRequest } = slice.actions

export default slice.reducer
