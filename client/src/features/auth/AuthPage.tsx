import React from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'store'
import Page from '../shared/Page'
import AuthSignIn, { AuthSignInProps } from './AuthSignIn'
import { authenticate } from './authSlice'

const AuthPage: React.FC = () => {
  const isAdmin = useAppSelector((s) => s.auth.isAdmin)
  const dispatch = useDispatch()

  const handleLogin: AuthSignInProps['onLogin'] = (username, password) => {
    dispatch(authenticate({ username, password }))
  }

  return (
    <Page>
      {isAdmin ? (
        <img id="qr" alt="QR Code" src="/resources/qr.png" />
      ) : (
        <AuthSignIn onLogin={handleLogin} />
      )}
    </Page>
  )
}

export default AuthPage
