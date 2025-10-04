import { SignIn, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const LogIn = () => {
  const { user, isSignedIn } = useUser()
  const history = useHistory()

  useEffect(() => {
    if (isSignedIn && user) {
      const userRole = user.publicMetadata?.role
      
      if (userRole === 'admin') {
        history.push('/mantenimiento')
      } else {
        history.push('/interfazmedico')
      }
    }
  }, [isSignedIn, user, history])

  return (
    <SignIn 
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-lg border rounded-lg p-6"
        }
      }}
      localization={{
        signIn: {
          start: {
            title: "Iniciar Sesión",
            subtitle: "Accede a tu cuenta"
          }
        },
        formFieldLabel__emailAddress: "Correo electrónico",
        formFieldLabel__password: "Contraseña",
        formButtonPrimary: "Continuar"
      }}
    />
  )
}

export default LogIn