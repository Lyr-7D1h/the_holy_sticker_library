import { LibraryBooks, SpeakerNotesOff } from "@material-ui/icons"
import React, { FC, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useRootSelector } from "../../store"
import Page from "../shared/Page"
import { getStickers } from "./librarySlice"
import { Sticker } from "@shared/types/library"

const LibraryPage: FC = () => {
  const [selected, setSelected] = useState("All")
  const dispatch = useDispatch()
  const drawerItems = [
    { title: "All", icon: <LibraryBooks /> },
    { title: "Untagged", icon: <SpeakerNotesOff /> },
  ]

  const stickers = useRootSelector<Sticker[]>((state) => state.library.stickers)

  useEffect(() => {
    dispatch(getStickers({ limit: 100 }))
  }, [selected])

  return (
    <Page drawer={{ items: drawerItems, selected, onChange: setSelected }}>
      Library
    </Page>
  )
}

export default LibraryPage
