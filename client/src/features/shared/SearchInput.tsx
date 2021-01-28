import { fade, makeStyles } from '@material-ui/core'
import { SearchOutlined } from '@material-ui/icons'
import React, { FC } from 'react'
import { useAppSelector } from 'store'
import AutoInput from './AutoInput'

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    width: '100%',
    marginLeft: theme.spacing(3),
  },
  admin: {},
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  inputRoot: {
    color: 'inherit',
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    textDecoration: 'none',
    width: '500px',
  },
}))

export interface SearchInputProps {
  onEnter?: (text: string) => void
}

const SearchInput: FC<SearchInputProps> = ({ onEnter }) => {
  const classes = useStyles()
  const options = useAppSelector((s) => s.library.uniqueTags)

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchOutlined />
      </div>
      <div style={{ width: '100%', textDecoration: 'none' }}>
        <AutoInput
          onEnter={onEnter}
          className={classes.input}
          classes={{
            root: classes.inputRoot,
          }}
          options={options}
          label=""
        />
      </div>
    </div>
  )
}

export default SearchInput
