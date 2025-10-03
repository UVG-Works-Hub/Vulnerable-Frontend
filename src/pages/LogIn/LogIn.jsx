import React, { useState } from 'react'
import Axios from 'axios'
import { Link, useHistory } from 'react-router-dom'

import { styles } from './LogIn.module.css'
import { SignIn, SignInButton } from '@clerk/clerk-react'

const LogIn = () => {
  return (
    <SignIn forceRedirectUrl="/mantenimiento" />
  )
}

export default LogIn
