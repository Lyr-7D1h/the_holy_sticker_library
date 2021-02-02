import { Card, Chip, makeStyles, Modal, Typography } from '@material-ui/core'
import { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'store'
import AutoInput from '../shared/AutoInput'
import { addTag } from './librarySlice'

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    height: '100%',
  },
  tags: {
    overflow: 'auto',
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  card: {
    padding: theme.spacing(4),
  },
}))

const LibraryImage: FC<{ hash: string }> = ({ hash }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const dispatch = useDispatch()

  const isAdmin = useAppSelector((s) => s.auth.isAdmin)
  const tags = useAppSelector((s) => s.library.tags)
  const options = useAppSelector((s) => s.library.uniqueTags)
  const stickerTags = tags.filter((s) => s.hash === hash)

  const classes = useStyles()

  function handleNewTag(tag: string) {
    if (stickerTags.some((s) => s.tag === tag)) {
      setError('Tag already on sticker')
    } else if (tag.length < 2) {
      setError('Tag too short (<3)')
    } else {
      if (error) setError(undefined)
      dispatch(addTag({ hash, tag }))
    }
  }

  return (
    <>
      <img
        onClick={() => {
          if (isAdmin) setOpen(true)
        }}
        className={classes.image}
        src={`/resources/stickers/${hash}.webp`}
      />
      <Modal
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Card className={classes.card}>
          <Typography variant="h5">{hash}</Typography>
          <div className={classes.tags}>
            {stickerTags.map((s) => (
              <Chip key={`${s.id}_${s.tag}_${s.hash}`} label={s.tag} />
            ))}
          </div>
          <div>
            <img
              style={{ padding: '10px' }}
              onClick={() => setOpen(true)}
              src={`/resources/stickers/${hash}.webp`}
            />
          </div>
          <AutoInput
            label="Choose a tag"
            onEnter={handleNewTag}
            options={options}
            error={error}
          />
        </Card>
      </Modal>
    </>
  )
}

export default LibraryImage
