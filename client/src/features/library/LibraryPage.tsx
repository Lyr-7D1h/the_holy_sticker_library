import { LibraryBooks, SpeakerNotesOff } from "@material-ui/icons"
import React, { FC, useState } from "react"
import { useDispatch } from "react-redux"
import Page from "../shared/Page"
import { getStickers } from "./librarySlice"

const LibraryPage: FC = () => {
  const [selected, setSelected] = useState("All")
  const dispatch = useDispatch()
  const drawerItems = [
    { title: "All", icon: <LibraryBooks /> },
    { title: "Untagged", icon: <SpeakerNotesOff /> },
  ]

  const stickers = dispatch(getStickers({ limit: 100 }))

  return (
    <Page drawer={{ items: drawerItems, selected, onChange: setSelected }}>
      Library
    </Page>
  )
}

export default LibraryPage
