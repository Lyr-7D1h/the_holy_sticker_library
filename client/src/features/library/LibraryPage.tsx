import { Delete, LibraryBooks, SpeakerNotesOff } from '@material-ui/icons'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store'
import Page from '../shared/Page'
import { getStickers, getTags, removeSticker } from './librarySlice'
import { Chip, Grid, IconButton, makeStyles } from '@material-ui/core'
import LibraryImage from './LibraryImage'
import { Sticker } from '@shared/sticker'

const useStyles = makeStyles(() => ({
  actions: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  tags: {
    position: 'absolute',
    top: 0,
    left: 0,
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

  const tags = useAppSelector((state) => state.library.tags)
  const stickers = useAppSelector((state) => state.library.stickers).map(
    (s) => ({
      ...s,
      tags: tags.filter((t) => t.hash === s.hash),
    })
  )
  function handleDelete(sticker: Sticker) {
    dispatch(removeSticker(sticker))
  }

  useEffect(() => {
    dispatch(getStickers({ limit: 100 }))
    dispatch(getTags())
  }, [selected])

  return (
    <Page drawer={{ items: drawerItems, selected, onChange: setSelected }}>
      <Grid container spacing={1}>
        {stickers.map((sticker) => (
          <Grid
            style={{ position: 'relative' }}
            key={sticker.hash}
            item
            sm={2}
            xs={12}
          >
            <div className={classes.tags}>
              {sticker.tags &&
                sticker.tags.map((s) => (
                  <Chip key={`${s.id}_${s.tag}_${s.hash}`} label={s.tag} />
                ))}
            </div>
            <div className={classes.actions}>
              <IconButton
                onClick={() => handleDelete(sticker)}
                aria-label="delete"
              >
                <Delete />
              </IconButton>
            </div>
            <LibraryImage hash={sticker.hash} />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

export default LibraryPage
