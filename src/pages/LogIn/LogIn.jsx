import React, { useState } from 'react'
import Axios from 'axios'
import { Link, useHistory } from 'react-router-dom'

import { styles } from './LogIn.module.css'

const LogIn = () => {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const history = useHistory()

  const handleChangeCorreo = (valor) => {
    // 👇 Store the input value to local state
    setCorreo(valor.target.value)
  }

  const handleChangeContraseña = (valor) => {
    // 👇 Store the input value to local state
    setContraseña(valor.target.value)
  }

  const getTipo = async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/usuarios/${correo}&${contraseña}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClick = async () => {
    const jason = await getTipo()
    let tipo
    let lugid
    let nom

    { jason.map((row) => {
      tipo = row.tipo
      lugid = 2
      nom = row.num_colegiado
      return tipo
    }) }

    if (tipo === 'admin') {
      history.push('/mantenimiento')
    } else {
      history.push('/interfazmedico', { lugarid: lugid, num: nom })
    }
  }

  return (
    <div className={styles}>
      <h1>Log In</h1>
      <h2>Correo</h2>
      <input type="text" placeholder="Escriba su correo" onChange={handleChangeCorreo} />
      <h2>Contraseña</h2>
      <input type="text" placeholder="Escriba su contraseña" onChange={handleChangeContraseña} />
      <br />
      <button type="submit" onClick={handleClick}>Ingresar</button>
      <br />
      <Link to="/signin">Registrate</Link>
    </div>
  )
}

export default LogIn
