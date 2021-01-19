import { configureStore } from "@reduxjs/toolkit"
import libraryReducer from "./features/library/librarySlice"

export default configureStore({
  reducer: {
    library: libraryReducer,
  },
})
