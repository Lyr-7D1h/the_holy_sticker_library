import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetStickersEvent } from '@shared/socket'
import { send } from '../socket/Socket'

const slice = createSlice({
  name: 'library',
  initialState: {
    stickers: [],
    tags: [],
  },
  reducers: {
    getTags(_, _action: PayloadAction) {
      //   const le = new GetStickersEvent(action.payload)
      //   send(le)
    },
    updateTags(state, action) {
      state.tags = action.payload
    },
    getStickers(_state, action) {
      send(new GetStickersEvent(action.payload))
    },
    updateStickers(state, action) {
      state.stickers = action.payload
    },
  },
})

export const { getStickers, getTags } = slice.actions

export default slice.reducer
