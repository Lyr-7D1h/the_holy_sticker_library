import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  GetStickersConstructor,
  GetStickersRequest,
  RemoveStickerRequest,
  Sticker,
} from '@shared/sticker'
import { send } from '../socket/Socket'
import { AddTagRequest, GetTagsRequest, Tag, TagCreate } from '@shared/tag'

const slice = createSlice({
  name: 'library',
  initialState: {
    stickers: [] as Sticker[],
    tags: [] as Tag[],
    uniqueTags: [] as string[],
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
      state.uniqueTags = action.payload
        .map((s) => s.tag)
        .filter((x, i, a) => a.indexOf(x) == i)
    },

    getStickers(_state, action: PayloadAction<GetStickersConstructor>) {
      send(new GetStickersRequest(action.payload))
    },
    updateStickers(state, action) {
      state.stickers = action.payload
    },

    removeSticker(_state, action: PayloadAction<Sticker>) {
      send(new RemoveStickerRequest(action.payload))
    },
    removeStickerResponse(state, action: PayloadAction<string>) {
      state.stickers = state.stickers.filter((s) => s.hash !== action.payload)
    },
  },
})

export const { getStickers, addTag, getTags, removeSticker } = slice.actions

export default slice.reducer
