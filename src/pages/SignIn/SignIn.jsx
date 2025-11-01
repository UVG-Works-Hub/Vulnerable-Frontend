import React, { useState } from 'react'
import Axios from 'axios'
import { useHistory, Link } from 'react-router-dom'

import { styles } from './SignIn.module.css'

const SignIn = () => {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [num_colegiado, setNum_colegiado] = useState('')
  let lugid
  const history = useHistory()

  const handleChangeCorreo = (valor) => {
    // 👇 Store the input value to local state
    setCorreo(valor.target.value)
  }

  const handleChangeContraseña = (valor) => {
    // 👇 Store the input value to local state
    setContraseña(valor.target.value)
  }

  const handleChangeNum = (valor) => {
    // 👇 Store the input value to local state
    setNum_colegiado(valor.target.value)
  }

  const getUserLugarid = async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/usuarios/get_lugarid/${num_colegiado}`)
      const jason = response.data
      jason.forEach((row) => {
        lugid = row.lugarid
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user lugar id:', error)
      throw error
    }
  }

  const addUser = async () => {
    try {
      const response = await Axios.post(`http://localhost:3000/api/v1/usuarios/${correo}&${contraseña}&${num_colegiado}&${lugid}`)
      return response.data
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  }

  const handleClick = async () => {
    try {
      await getUserLugarid()
      await addUser()
      history.push('/interfazmedico', { lugarid: lugid, num: num_colegiado })
    } catch (error) {
      console.error('Error during sign in:', error)
      alert('Error durante el registro. Por favor, intente nuevamente.')
    }
  }

  return (
    <div className={styles}>
      <h1>Sign In</h1>
      <h2>Correo</h2>
      <input type="text" placeholder="Escriba su correo" onChange={handleChangeCorreo} />
      <h2>Contraseña</h2>
      <input type="text" placeholder="Escriba su contraseña" onChange={handleChangeContraseña} />
      <h2>Numero de colegiado</h2>
      <input type="text" placeholder="Escriba el numero" onChange={handleChangeNum} />
      <br />
      <button type="submit" onClick={handleClick}>Registrarse</button>
      <br />
      <Link to="/login">Ingresa</Link>
    </div>
  )
}

export default SignIn
