import { Delete, LibraryBooks, SpeakerNotesOff } from '@material-ui/icons'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store'
import Page from '../shared/Page'
import { getStickers, getTags, removeSticker } from './librarySlice'
import { Chip, Grid, IconButton, makeStyles } from '@material-ui/core'
import LibraryImage from './LibraryImage'
import { GetStickersConstructor, Sticker } from '@shared/sticker'
import { Waypoint } from 'react-waypoint'

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
  const [stickerOptions, setStickerOptions] = useState<GetStickersConstructor>(
    {}
  )
  const classes = useStyles()
  const dispatch = useDispatch()
  const drawerItems = [
    { title: 'All', icon: <LibraryBooks /> },
    { title: 'Untagged', icon: <SpeakerNotesOff /> },
  ]

  const isAdmin = useAppSelector((s) => s.auth.isAdmin)
  const tags = useAppSelector((state) => state.library.tags)
  const stickers = useAppSelector((state) => state.library.stickers).map(
    (s) => ({
      ...s,
      tags: tags.filter((t) => t.hash === s.hash),
    })
  )

  function handleDelete(sticker: Sticker) {
    if (window.confirm('Are your sure you want to remove this?')) {
      dispatch(removeSticker(sticker))
    }
  }
  function handleSearch(text: string) {
    setStickerOptions((s) => ({
      ...s,
      hasTag: text,
      page: 0,
    }))
  }
  function handleFilter(title: string) {
    if (title === 'Untagged') {
      setStickerOptions({ noTag: true })
    } else if (title === 'All') {
      setStickerOptions({})
    }
  }
  function handleNextPage() {
    setStickerOptions((s) => ({ ...s, page: s.page ? s.page + 1 : 1 }))
  }

  useEffect(() => {
    dispatch(getStickers(stickerOptions))
  }, [stickerOptions])

  useEffect(() => {
    dispatch(getTags())
  }, [])

  return (
    <Page
      onSearch={handleSearch}
      drawer={{
        items: drawerItems,
        defaultSelected: 'All',
        onChange: handleFilter,
      }}
    >
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
            {isAdmin && (
              <div className={classes.actions}>
                <IconButton
                  onClick={() => handleDelete(sticker)}
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </div>
            )}
            <LibraryImage hash={sticker.hash} />
          </Grid>
        ))}
        {stickers.length >= 50 && <Waypoint onEnter={handleNextPage} />}
      </Grid>
    </Page>
  )
}

export default LibraryPage
