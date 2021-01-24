import { Card, Chip, makeStyles, Modal, Typography } from '@material-ui/core'
import { FC, useState } from 'react'
import { useAppSelector } from 'store'
import AutoInput, { AutoInputOption } from '../shared/AutoInput'

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    height: '100%',
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
  const options: AutoInputOption[] = useAppSelector((s) => s.library.tags).map(
    (t) => ({
      id: t.id,
      label: t.tag,
    })
  )

  const classes = useStyles()

  function handleNewTag(tag: string) {
    console.log(tag)
  }

  return (
    <>
      <img
        onClick={() => setOpen(true)}
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
          <div>
            <Chip label="asdf" />
          </div>
          <div>
            <img
              onClick={() => setOpen(true)}
              src={`/resources/stickers/${hash}.webp`}
            />
          </div>
          <AutoInput onEnter={handleNewTag} options={options} />
        </Card>
      </Modal>
    </>
  )
}

export default LibraryImage
