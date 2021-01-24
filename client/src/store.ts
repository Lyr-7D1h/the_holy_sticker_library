import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import librarySlice from './features/library/librarySlice'
import socketReducer from './features/socket/socketSlice'

const store = configureStore({
  reducer: {
    library: librarySlice,
    socket: socketReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
