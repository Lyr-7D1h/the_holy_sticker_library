import {
  Typography,
  makeStyles,
  Container,
  CssBaseline,
  Avatar,
  TextField,
  Button,
} from '@material-ui/core'
import { Lock } from '@material-ui/icons'
import React, { FC, FormEventHandler, useState } from 'react'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export interface AuthSignInProps {
  onLogin?: (username: string, password: string) => void
}
const AuthSignIn: FC<AuthSignInProps> = ({ onLogin }) => {
  const classes = useStyles()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin: FormEventHandler = (e) => {
    e.preventDefault()
    if (username.length > 0 && password.length > 0) {
      if (onLogin) onLogin(username, password)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Lock />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={handleLogin} noValidate className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  )
}

export default AuthSignIn
