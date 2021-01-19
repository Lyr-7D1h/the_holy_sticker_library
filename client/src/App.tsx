import React from "react"
import AuthPage from "./features/auth/AuthPage"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import LibraryPage from "./features/library/LibraryPage"

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth">
          <AuthPage />;
        </Route>
        <Route path="/">
          <LibraryPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
