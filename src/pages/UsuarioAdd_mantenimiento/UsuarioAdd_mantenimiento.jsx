import React, { useState } from 'react'
import Axios from 'axios'
import PropTypes from 'prop-types'

import { styles } from './UsuarioAdd_mantenimiento.module.css'

const UsuarioAdd_mantenimiento = ({ lugid }) => {
  const [correo, setCorreo] = useState(null)
  const [contraseña, setContraseña] = useState(null)
  const [num_colegiado, setNum_colegiado] = useState(null)

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

  const agregarUsuario = async () => {
    try {
      const response = await Axios.post(`http://localhost:3000/api/v1/usuarios/${correo}&${contraseña}&${num_colegiado}&${lugid}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClick = async () => {
    await agregarUsuario()
  }

  return (
    <div className={styles}>

      <h2>Correo</h2>
      <input type="text" placeholder="Escriba el correo" onChange={handleChangeCorreo} />
      <br />

      <h2>Contraseña</h2>
      <input type="text" placeholder="Escriba la contraseña" onChange={handleChangeContraseña} />
      <br />

      <h2>num_colegiado</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />

      <button type="submit" onClick={handleClick}>Agregar</button>
    </div>
  )
}

UsuarioAdd_mantenimiento.propTypes = {
  lugid: PropTypes.number,
}

UsuarioAdd_mantenimiento.defaultProps = {
  lugid: PropTypes.number,
}

export default UsuarioAdd_mantenimiento
