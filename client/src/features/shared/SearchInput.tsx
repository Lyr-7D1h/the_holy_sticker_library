import { fade, InputBase, makeStyles } from "@material-ui/core"
import { SearchOutlined } from "@material-ui/icons"
import React, { FC } from "react"

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    width: "100%",
    marginLeft: theme.spacing(3),
  },
  admin: {},
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}))

const SearchInput: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchOutlined />
      </div>
      <InputBase
        placeholder="Search…"
        className={classes.input}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  )
}

export default SearchInput
