import { createSlice } from "@reduxjs/toolkit"
import { send } from "../util/Socket"

export const slice = createSlice({
  name: "library",
  initialState: {},
  reducers: {
    getStickers: (state, action) => {
      console.log(state, action.type, action.payload)
      send(action.type, action.payload)
    },
  },
})

export const { getStickers } = slice.actions

export default slice.reducer
