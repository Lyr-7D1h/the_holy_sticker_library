import { createSlice } from "@reduxjs/toolkit"
import { send } from "../socket/Socket"

const slice = createSlice({
  name: "library",
  initialState: {
    stickers: [],
  },
  reducers: {
    getStickers(state, action) {
      send(
        { sender: action.type, receiver: "library/updateStickers" },
        action.payload
      )
    },
    updateStickers(state, action) {
      state.stickers = action.payload
    },
  },
})

export const { getStickers } = slice.actions

export default slice.reducer
