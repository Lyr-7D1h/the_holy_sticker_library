import { configureStore } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import librarySlice from './features/library/librarySlice'
import socketReducer from './features/socket/socketSlice'

const store = configureStore({
  reducer: {
    library: librarySlice,
    socket: socketReducer,
  },
})

type RootState = ReturnType<typeof store.getState>
export function useRootSelector<TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected {
  return useSelector<RootState, TSelected>(selector)
}

export default store
