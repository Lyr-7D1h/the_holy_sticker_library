import { LibraryBooks, SpeakerNotesOff } from '@material-ui/icons'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRootSelector } from '../../store'
import Page from '../shared/Page'
import { getStickers, getTags } from './librarySlice'
import { Sticker } from '@shared/types/library'
import { fade, Grid, makeStyles } from '@material-ui/core'
import LibraryImage from './LibraryImage'

const useStyles = makeStyles((theme) => ({
  gridItem: {
    zIndex: 500,
    // TODO: fix hover
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.8),
    },
  },
}))

const LibraryPage: FC = () => {
  const [selected, setSelected] = useState('All')
  const classes = useStyles()
  const dispatch = useDispatch()
  const drawerItems = [
    { title: 'All', icon: <LibraryBooks /> },
    { title: 'Untagged', icon: <SpeakerNotesOff /> },
  ]

  const stickers = useRootSelector<Sticker[]>((state) => state.library.stickers)
  console.log(stickers)

  useEffect(() => {
    dispatch(getStickers({ limit: 100 }))
    dispatch(getTags())
  }, [selected])

  return (
    <Page drawer={{ items: drawerItems, selected, onChange: setSelected }}>
      <Grid container spacing={1}>
        {stickers.map((sticker) => (
          <Grid
            className={classes.gridItem}
            key={sticker.hash}
            item
            sm={1}
            xs={12}
            spacing={3}
          >
            <LibraryImage hash={sticker.hash} />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

export default LibraryPage
