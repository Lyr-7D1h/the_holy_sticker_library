import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core'
import React, { FC } from 'react'
import Link from './Link'
import SearchInput from './SearchInput'
import SelectableDrawer, {
  drawerWidth,
  SelectableDrawerProps,
} from './SelectableDrawer'

const useStyles = makeStyles((theme) => ({
  appbar: {
    zIndex: theme.zIndex.drawer + 2,
  },
  page: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  admin: {},
}))

export interface PageProps {
  drawer?: SelectableDrawerProps
  onSearch?: (text: string) => void
}

const Page: FC<PageProps> = ({ children, drawer, onSearch }) => {
  const classes = useStyles()
  return (
    <div className={classes.page}>
      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar aria-label="asdf" color="inherit">
          <Link to="/">
            <Typography variant="h6" noWrap>
              Holy Sticker Library
            </Typography>
          </Link>
          {onSearch && <SearchInput onEnter={onSearch} />}
          <div className={classes.admin}>
            <Link to="auth">
              <Button
                style={{ width: '20vw' }}
                variant="contained"
                color="secondary"
              >
                ADMIN
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <nav>{drawer && <SelectableDrawer {...drawer} />}</nav>
      <main
        style={{ marginLeft: drawer ? drawerWidth : 0 }}
        className={classes.content}
      >
        <div className={classes.toolbar} />
        {children || ''}
      </main>
    </div>
  )
}

export default Page
