import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetStickersParams, GetStickersRequest, Sticker } from '@shared/sticker'
import { send } from '../socket/Socket'
import { AddTagRequest, GetTagsRequest, Tag, TagCreate } from '@shared/tag'

const slice = createSlice({
  name: 'library',
  initialState: {
    stickers: [] as Sticker[],
    tags: [] as Tag[],
  },
  reducers: {
    addTag(_state, action: PayloadAction<TagCreate>) {
      send(new AddTagRequest(action.payload))
    },
    addTagResponse(state, action: PayloadAction<Tag>) {
      state.tags.push(action.payload)
    },

    getTags() {
      send(new GetTagsRequest())
    },
    getTagsResponse(state, action: PayloadAction<Tag[]>) {
      state.tags = action.payload
    },

    getStickers(_state, action: PayloadAction<GetStickersParams>) {
      send(new GetStickersRequest(action.payload))
    },
    updateStickers(state, action) {
      state.stickers = action.payload
    },
  },
})

export const { getStickers, addTag, getTags } = slice.actions

export default slice.reducer
