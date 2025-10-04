import React, { useState } from 'react'
import Axios from 'axios'
import PropTypes from 'prop-types'

import { styles } from './UsuarioAdd_mantenimiento.module.css'
import {
  validateAndSanitize, isValidNumeroColegiado, isValidEmail,
} from '../../utils/sanitizer'

const UsuarioAdd_mantenimiento = ({ lugid }) => {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [num_colegiado, setNum_colegiado] = useState('')

  // Estados para errores de validación
  const [correoError, setCorreoError] = useState('')
  const [contraseñaError, setContraseñaError] = useState('')
  const [numColegiadoError, setNumColegiadoError] = useState('')

  const handleChangeCorreo = (valor) => {
    const { value } = valor.target
    setCorreo(value)

    // Validar email en tiempo real
    if (value.trim() === '') {
      setCorreoError('')
    } else if (!isValidEmail(value)) {
      setCorreoError('Email inválido')
    } else {
      setCorreoError('')
    }
  }

  const handleChangeContraseña = (valor) => {
    const { value } = valor.target
    setContraseña(value)

    // Validar longitud en tiempo real (mínimo 6 caracteres)
    if (value.length > 0 && value.length < 6) {
      setContraseñaError('Mínimo 6 caracteres')
    } else {
      setContraseñaError('')
    }
  }

  const handleChangeNum = (valor) => {
    const { value } = valor.target
    setNum_colegiado(value)

    // Validar número de colegiado en tiempo real
    if (value.trim() === '') {
      setNumColegiadoError('')
    } else if (!isValidNumeroColegiado(value)) {
      setNumColegiadoError('Número de colegiado inválido (4-8 dígitos)')
    } else {
      setNumColegiadoError('')
    }
  }

  const agregarUsuario = async () => {
    try {
      // Validar y sanitizar correo (requerido, formato de email)
      const correoValidation = validateAndSanitize(correo, {
        required: true,
        type: 'email',
        maxLength: 100,
      })

      if (!correoValidation.isValid) {
        throw new Error(`Correo: ${correoValidation.error}`)
      }

      // Validar y sanitizar contraseña (requerida, mínimo 6 caracteres)
      const contraseñaValidation = validateAndSanitize(contraseña, {
        required: true,
        maxLength: 100,
        customValidator: (value) => { return value.length >= 6 },
      })

      if (!contraseñaValidation.isValid) {
        throw new Error(`Contraseña: ${contraseñaValidation.error || 'Mínimo 6 caracteres'}`)
      }

      // Validar y sanitizar número de colegiado (requerido, formato válido)
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: 'numeroColegiado',
        maxLength: 8,
      })

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`)
      }

      // Validar y sanitizar lugar ID (número positivo)
      const lugarIdValidation = validateAndSanitize(String(lugid), {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseInt(value, 10) > 0 },
      })

      if (!lugarIdValidation.isValid) {
        throw new Error(`Lugar ID: ${lugarIdValidation.error || 'Debe ser un número positivo'}`)
      }

      const response = await Axios.post(`http://localhost:3000/api/v1/usuarios/${correoValidation.sanitizedValue}&${contraseñaValidation.sanitizedValue}&${numColegiadoValidation.sanitizedValue}&${lugarIdValidation.sanitizedValue}`)
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClick = async () => {
    try {
      await agregarUsuario()
      alert('Usuario agregado exitosamente')

      // Limpiar formulario después del éxito
      setCorreo('')
      setContraseña('')
      setNum_colegiado('')

      // Limpiar errores
      setCorreoError('')
      setContraseñaError('')
      setNumColegiadoError('')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <div className={styles}>

      <h2>Correo *</h2>
      <input
        type="email"
        placeholder="Escriba el correo electrónico"
        value={correo}
        onChange={handleChangeCorreo}
        maxLength="100"
        style={{ borderColor: correoError ? 'red' : 'inherit' }}
      />
      {correoError && <span style={{ color: 'red', fontSize: '12px' }}>{correoError}</span>}
      <br />

      <h2>Contraseña *</h2>
      <input
        type="password"
        placeholder="Escriba la contraseña (mínimo 6 caracteres)"
        value={contraseña}
        onChange={handleChangeContraseña}
        maxLength="100"
        style={{ borderColor: contraseñaError ? 'red' : 'inherit' }}
      />
      {contraseñaError && <span style={{ color: 'red', fontSize: '12px' }}>{contraseñaError}</span>}
      <br />

      <h2>Número de Colegiado *</h2>
      <input
        type="text"
        placeholder="Escriba el número de colegiado (4-8 dígitos)"
        value={num_colegiado}
        onChange={handleChangeNum}
        maxLength="8"
        pattern="\d{4,8}"
        style={{ borderColor: numColegiadoError ? 'red' : 'inherit' }}
      />
      {numColegiadoError && <span style={{ color: 'red', fontSize: '12px' }}>{numColegiadoError}</span>}
      <br />

      <button type="submit" onClick={handleClick}>Agregar Usuario</button>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        * Campos requeridos
      </p>
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
