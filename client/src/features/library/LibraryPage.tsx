import { LibraryBooks, SpeakerNotesOff } from "@material-ui/icons"
import React, { ReactElement, useState } from "react"
import Page from "../shared/Page"

const LibraryPage = (): ReactElement => {
  const [selected, setSelected] = useState("All")
  const drawerItems = [
    { title: "All", icon: <LibraryBooks /> },
    { title: "Untagged", icon: <SpeakerNotesOff /> },
  ]
  return (
    <Page drawer={{ items: drawerItems, selected, onChange: setSelected }}>
      Library
    </Page>
  )
}

export default LibraryPage
