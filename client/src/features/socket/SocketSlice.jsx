import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
  name: "socket",
  initialState: null,
  reducers: {
    notFound(_state, action) {
      console.error(action.payload)
    },
    error(_state, action) {
      console.error(action.payload)
    },
  },
})

export default slice.reducer
