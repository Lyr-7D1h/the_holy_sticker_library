import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import React, { FC, ReactElement } from "react"

export const drawerWidth = 230

const useStyles = makeStyles({
  drawer: {
    overflow: "auto",
  },
  drawerPaper: {
    width: drawerWidth,
  },
})

export interface SelectableDrawerProps {
  items: { title: string; icon: ReactElement }[]
  selected?: string
  onChange: (title: string) => void
}

const SelectableDrawer: FC<SelectableDrawerProps> = ({
  items,
  onChange,
  selected = "",
}) => {
  const classes = useStyles()

  return (
    <Drawer
      open
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <List>
        {items.map((item, i) => (
          <ListItem
            onClick={() => onChange(item.title)}
            selected={item.title === selected}
            key={`${item.title}-${i}`}
            button
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default SelectableDrawer
