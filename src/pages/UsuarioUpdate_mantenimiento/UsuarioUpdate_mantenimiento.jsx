import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import PropTypes from 'prop-types'
import { ShowAllUsuarios } from '../../components'

import { styles } from './UsuarioUpdate_mantenimiento.module.css'
import {
  validateAndSanitize, isValidNumeroColegiado,
} from '../../utils/sanitizer'

const UsuarioUpdate_mantenimiento = ({ lugid }) => {
  const [responseData, setResponseData] = useState(null)
  const [num_colegiado, setNum_colegiado] = useState('')
  const [data, setData] = useState('')

  // Estados para errores de validación
  const [numColegiadoError, setNumColegiadoError] = useState('')
  const [dataError, setDataError] = useState('')

  const handleChangeNum = (valor) => {
    const { value } = valor.target
    setNum_colegiado(value)

    // Validar número de colegiado en tiempo real
    if (value.trim() === '' || isValidNumeroColegiado(value)) {
      setNumColegiadoError('')
    } else {
      setNumColegiadoError('Número de colegiado inválido (4-8 dígitos)')
    }
  }

  const handleChangeData = (valor) => {
    const { value } = valor.target
    setData(value)

    // Validar longitud en tiempo real (máximo 255 caracteres)
    if (value.length > 255) {
      setDataError('Máximo 255 caracteres')
    } else {
      setDataError('')
    }
  }

  const getUsuarios = async () => {
    try {
      const lugarIdValidation = validateAndSanitize(String(lugid), {
        required: true,
        maxLength: 10,
      })

      if (!lugarIdValidation.isValid) {
        throw new Error(lugarIdValidation.error)
      }

      const response = await Axios.get(`http://localhost:3000/api/v1/usuarios/lugar/${lugarIdValidation.sanitizedValue}`)
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const loadUsuarios = async () => {
    setResponseData(await getUsuarios())
  }

  const updateCorreo = async () => {
    try {
      // Validar número de colegiado
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: 'numeroColegiado',
        maxLength: 8,
      })

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`)
      }

      // Validar correo (requerido, formato de email)
      const correoValidation = validateAndSanitize(data, {
        required: true,
        type: 'email',
        maxLength: 100,
      })

      if (!correoValidation.isValid) {
        throw new Error(`Correo: ${correoValidation.error}`)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/usuarios/correo/${numColegiadoValidation.sanitizedValue}`, {
        correo: correoValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickCorreo = async () => {
    try {
      await updateCorreo()
      await loadUsuarios()
      alert('Correo actualizado exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateContraseña = async () => {
    try {
      // Validar número de colegiado
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: 'numeroColegiado',
        maxLength: 8,
      })

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`)
      }

      // Validar contraseña (requerida, mínimo 6 caracteres)
      const contraseñaValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 100,
        customValidator: (value) => { return value.length >= 6 },
      })

      if (!contraseñaValidation.isValid) {
        throw new Error(`Contraseña: ${contraseñaValidation.error || 'Mínimo 6 caracteres'}`)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/usuarios/contrasena/${numColegiadoValidation.sanitizedValue}`, {
        contrasena: contraseñaValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickContraseña = async () => {
    try {
      await updateContraseña()
      await loadUsuarios()
      alert('Contraseña actualizada exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateNum_colegiado = async () => {
    try {
      // Validar número de colegiado actual
      const currentNumValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: 'numeroColegiado',
        maxLength: 8,
      })

      if (!currentNumValidation.isValid) {
        throw new Error(`Número de colegiado actual: ${currentNumValidation.error}`)
      }

      // Validar nuevo número de colegiado
      const newNumValidation = validateAndSanitize(data, {
        required: true,
        type: 'numeroColegiado',
        maxLength: 8,
      })

      if (!newNumValidation.isValid) {
        throw new Error(`Nuevo número de colegiado: ${newNumValidation.error}`)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/usuarios/colegiado/${currentNumValidation.sanitizedValue}`, {
        nuevoNumeroColegiado: newNumValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickNum_colegiado = async () => {
    try {
      await updateNum_colegiado()
      await loadUsuarios()
      alert('Número de colegiado actualizado exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
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

      <h2>Cambiar correo *</h2>
      <input
        type="text"
        placeholder="Número de colegiado (4-8 dígitos)"
        value={num_colegiado}
        onChange={handleChangeNum}
        maxLength="8"
        pattern="\d{4,8}"
        style={{ borderColor: numColegiadoError ? 'red' : 'inherit' }}
      />
      {numColegiadoError && <span style={{ color: 'red', fontSize: '12px' }}>{numColegiadoError}</span>}
      <br />
      <input
        type="email"
        placeholder="Escriba el nuevo correo electrónico"
        value={data}
        onChange={handleChangeData}
        maxLength="100"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickCorreo}>Cambiar Correo</button>

      <h2>Cambiar contraseña *</h2>
      <input
        type="text"
        placeholder="Número de colegiado (4-8 dígitos)"
        value={num_colegiado}
        onChange={handleChangeNum}
        maxLength="8"
        pattern="\d{4,8}"
        style={{ borderColor: numColegiadoError ? 'red' : 'inherit' }}
      />
      {numColegiadoError && <span style={{ color: 'red', fontSize: '12px' }}>{numColegiadoError}</span>}
      <br />
      <input
        type="password"
        placeholder="Escriba la nueva contraseña (mínimo 6 caracteres)"
        value={data}
        onChange={handleChangeData}
        maxLength="100"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickContraseña}>Cambiar Contraseña</button>

      <h2>Cambiar número de colegiado *</h2>
      <input
        type="text"
        placeholder="Número de colegiado actual (4-8 dígitos)"
        value={num_colegiado}
        onChange={handleChangeNum}
        maxLength="8"
        pattern="\d{4,8}"
        style={{ borderColor: numColegiadoError ? 'red' : 'inherit' }}
      />
      {numColegiadoError && <span style={{ color: 'red', fontSize: '12px' }}>{numColegiadoError}</span>}
      <br />
      <input
        type="text"
        placeholder="Escriba el nuevo número de colegiado (4-8 dígitos)"
        value={data}
        onChange={handleChangeData}
        maxLength="8"
        pattern="\d{4,8}"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickNum_colegiado}>Cambiar Número de Colegiado</button>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        * Campos requeridos
      </p>
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
