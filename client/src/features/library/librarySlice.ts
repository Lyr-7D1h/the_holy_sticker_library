import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetStickersRequest, Sticker } from '@shared/sticker'
import { send } from '../socket/Socket'
import { AddTagRequest, GetTagsRequest, Tag, TagCreate } from '@shared/tag'

const slice = createSlice({
  name: 'library',
  initialState: {
    stickers: [] as Sticker[],
    tags: [] as Tag[],
  },
  reducers: {
    addTagResponse(state, action: PayloadAction<Tag>) {
      state.tags.push(action.payload)
    },
    addTag(_state, action: PayloadAction<TagCreate>) {
      send(new AddTagRequest(action.payload))
    },

    getTags() {
      send(new GetTagsRequest())
    },
    getTagsResponse(state, action: PayloadAction<Tag[]>) {
      state.tags = action.payload
    },

    getStickers(_state, action) {
      send(new GetStickersRequest(action.payload))
    },
    updateStickers(state, action) {
      state.stickers = action.payload
    },
  },
})

export const { getStickers, addTag, getTags } = slice.actions

export default slice.reducer
