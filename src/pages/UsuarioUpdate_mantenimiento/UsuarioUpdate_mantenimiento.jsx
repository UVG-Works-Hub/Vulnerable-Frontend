import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import PropTypes from 'prop-types'
import { ShowAllUsuarios } from '../../components'

import { styles } from './UsuarioUpdate_mantenimiento.module.css'

const UsuarioUpdate_mantenimiento = ({ lugid }) => {
  const [responseData, setResponseData] = useState(null)
  const [num_colegiado, setNum_colegiado] = useState(null)
  const [data, setData] = useState(null)

  const handleChangeNum = (valor) => {
    // 👇 Store the input value to local state
    setNum_colegiado(valor.target.value)
  }

  const handleChangeData = (valor) => {
    // 👇 Store the input value to local state
    setData(valor.target.value)
  }

  const getUsuarios = async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/usuarios/by_lugarid/${lugid}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const loadUsuarios = async () => {
    setResponseData(await getUsuarios())
  }

  const updateCorreo = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/usuarios/update_correo/${data}&${num_colegiado}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickCorreo = async () => {
    await updateCorreo()
    await loadUsuarios()
  }

  const updateContraseña = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/usuarios/update_password/${data}&${num_colegiado}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickContraseña = async () => {
    await updateContraseña()
    await loadUsuarios()
  }

  const updateNum_colegiado = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/usuarios/update_num/${data}&${num_colegiado}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickNum_colegiado = async () => {
    await updateNum_colegiado()
    await loadUsuarios()
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  if (!responseData) {
    return 'Loading...'
  }

  return (
    <div className={styles}>
      <ShowAllUsuarios json={responseData} />

      <h2>Cambiar correo</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba el nuevo correo" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickCorreo}>Cambiar</button>

      <h2>Cambiar contraseña</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba el nuevo apellido" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickContraseña}>Cambiar</button>

      <h2>Cambiar numero de colegiado</h2>
      <input type="text" placeholder="Escriba el numero de colegiado actual" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba el nuevo numero de colegiado actual" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickNum_colegiado}>Cambiar</button>

    </div>
  )
}

UsuarioUpdate_mantenimiento.propTypes = {
  lugid: PropTypes.number,
}

UsuarioUpdate_mantenimiento.defaultProps = {
  lugid: PropTypes.number,
}

export default UsuarioUpdate_mantenimiento
