import React from 'react'
import {
  Switch,
  Route,
} from 'react-router-dom'

import LogIn from './LogIn'
import SignIn from './SignIn'
import Welcome from './Welcome'
import Mantenimiento from './Mantenimiento'
import InterfazMedico from './InterfazMedico'

const navigate = (page) => {
  window.location = `/?route=${page}`
}

const Page = () => {
  // escoger la pagina

  return (
    <Switch>
      <Route path="/login">
        <LogIn />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/interfazmedico">
        <InterfazMedico />
      </Route>
      <Route path="/mantenimiento">
        <Mantenimiento />
      </Route>
      <Route path="/">
        <Welcome />
      </Route>
    </Switch>
  )
}

export { navigate }
export default Page
