import React, { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Link as MaterialLink } from "@material-ui/core"

const Link: FC<{ to: string }> = ({ children, to }) => {
  return (
    <MaterialLink
      color="inherit"
      underline="none"
      component={RouterLink}
      to={to}
    >
      {children}
    </MaterialLink>
  )
}

export default Link
