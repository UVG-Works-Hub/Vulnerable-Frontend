import React, { useState } from 'react'
import Axios from 'axios'
import PropTypes from 'prop-types'

import { styles } from './MedicoAdd_mantenimiento.module.css'
import {
  validateAndSanitize, isValidNumeroColegiado, isValidPhone,
} from '../../utils/sanitizer'

const MedicoAdd_mantenimiento = ({ lugarid }) => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [num_colegiado, setNum_colegiado] = useState('')
  const [especialidad, setEspecialidad] = useState('')

  // Estados para errores de validación
  const [nombreError, setNombreError] = useState('')
  const [apellidoError, setApellidoError] = useState('')
  const [direccionError, setDireccionError] = useState('')
  const [telefonoError, setTelefonoError] = useState('')
  const [numColegiadoError, setNumColegiadoError] = useState('')
  const [especialidadError, setEspecialidadError] = useState('')

  const handleChangeNombre = (valor) => {
    const { value } = valor.target
    setNombre(value)

    // Validar longitud en tiempo real (máximo 100 caracteres)
    if (value.length > 100) {
      setNombreError('Máximo 100 caracteres')
    } else {
      setNombreError('')
    }
  }

  const handleChangeApellido = (valor) => {
    const { value } = valor.target
    setApellido(value)

    // Validar longitud en tiempo real (máximo 100 caracteres)
    if (value.length > 100) {
      setApellidoError('Máximo 100 caracteres')
    } else {
      setApellidoError('')
    }
  }

  const handleChangeDireccion = (valor) => {
    const { value } = valor.target
    setDireccion(value)

    // Validar longitud en tiempo real (máximo 200 caracteres)
    if (value.length > 200) {
      setDireccionError('Máximo 200 caracteres')
    } else {
      setDireccionError('')
    }
  }

  const handleChangeTelefono = (valor) => {
    const { value } = valor.target
    setTelefono(value)

    // Validar teléfono en tiempo real
    if (value.trim() === '') {
      setTelefonoError('')
    } else if (!isValidPhone(value)) {
      setTelefonoError('Teléfono inválido')
    } else {
      setTelefonoError('')
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

  const handleChangeEspecialidad = (valor) => {
    const { value } = valor.target
    setEspecialidad(value)

    // Validar longitud en tiempo real (máximo 100 caracteres)
    if (value.length > 100) {
      setEspecialidadError('Máximo 100 caracteres')
    } else {
      setEspecialidadError('')
    }
  }

  const agregarDoctor = async () => {
    try {
      // Validar y sanitizar nombre (requerido, máximo 100 caracteres, seguridad estricta)
      const nombreValidation = validateAndSanitize(nombre, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      })

      if (!nombreValidation.isValid) {
        throw new Error(`Nombre: ${nombreValidation.error}`)
      }

      // Validar y sanitizar apellido (requerido, máximo 100 caracteres, seguridad estricta)
      const apellidoValidation = validateAndSanitize(apellido, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      })

      if (!apellidoValidation.isValid) {
        throw new Error(`Apellido: ${apellidoValidation.error}`)
      }

      // Validar y sanitizar dirección (requerida, máximo 200 caracteres)
      const direccionValidation = validateAndSanitize(direccion, {
        required: true,
        maxLength: 200,
      })

      if (!direccionValidation.isValid) {
        throw new Error(`Dirección: ${direccionValidation.error}`)
      }

      // Validar y sanitizar teléfono (requerido, formato de teléfono)
      const telefonoValidation = validateAndSanitize(telefono, {
        required: true,
        type: 'phone',
        maxLength: 15,
      })

      if (!telefonoValidation.isValid) {
        throw new Error(`Teléfono: ${telefonoValidation.error}`)
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

      // Validar y sanitizar especialidad (requerida, máximo 100 caracteres, seguridad estricta)
      const especialidadValidation = validateAndSanitize(especialidad, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      })

      if (!especialidadValidation.isValid) {
        throw new Error(`Especialidad: ${especialidadValidation.error}`)
      }

      // Validar y sanitizar lugar ID (número positivo)
      const lugarIdValidation = validateAndSanitize(String(lugarid), {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseInt(value, 10) > 0 },
      })

      if (!lugarIdValidation.isValid) {
        throw new Error(`Lugar ID: ${lugarIdValidation.error || 'Debe ser un número positivo'}`)
      }

      const response = await Axios.post(`http://localhost:3000/api/v1/medicos/${nombreValidation.sanitizedValue}&${apellidoValidation.sanitizedValue}&${direccionValidation.sanitizedValue}&${telefonoValidation.sanitizedValue}&${numColegiadoValidation.sanitizedValue}&${especialidadValidation.sanitizedValue}&${lugarIdValidation.sanitizedValue}`)
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClick = async () => {
    try {
      await agregarDoctor()
      alert('Médico agregado exitosamente')

      // Limpiar formulario después del éxito
      setNombre('')
      setApellido('')
      setDireccion('')
      setTelefono('')
      setNum_colegiado('')
      setEspecialidad('')

      // Limpiar errores
      setNombreError('')
      setApellidoError('')
      setDireccionError('')
      setTelefonoError('')
      setNumColegiadoError('')
      setEspecialidadError('')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <div className={styles}>
      <h2>Nombre *</h2>
      <input
        type="text"
        placeholder="Escriba el nombre"
        value={nombre}
        onChange={handleChangeNombre}
        maxLength="100"
        style={{ borderColor: nombreError ? 'red' : 'inherit' }}
      />
      {nombreError && <span style={{ color: 'red', fontSize: '12px' }}>{nombreError}</span>}
      <br />

      <h2>Apellido *</h2>
      <input
        type="text"
        placeholder="Escriba el apellido"
        value={apellido}
        onChange={handleChangeApellido}
        maxLength="100"
        style={{ borderColor: apellidoError ? 'red' : 'inherit' }}
      />
      {apellidoError && <span style={{ color: 'red', fontSize: '12px' }}>{apellidoError}</span>}
      <br />

      <h2>Dirección *</h2>
      <textarea
        placeholder="Escriba la dirección completa"
        value={direccion}
        onChange={handleChangeDireccion}
        maxLength="200"
        rows="3"
        style={{ borderColor: direccionError ? 'red' : 'inherit' }}
      />
      {direccionError && <span style={{ color: 'red', fontSize: '12px' }}>{direccionError}</span>}
      <br />

      <h2>Teléfono *</h2>
      <input
        type="tel"
        placeholder="Escriba el teléfono (ej: +502 1234-5678)"
        value={telefono}
        onChange={handleChangeTelefono}
        maxLength="15"
        pattern="[0-9+\-\s()]{10,15}"
        style={{ borderColor: telefonoError ? 'red' : 'inherit' }}
      />
      {telefonoError && <span style={{ color: 'red', fontSize: '12px' }}>{telefonoError}</span>}
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

      <h2>Especialidad *</h2>
      <input
        type="text"
        placeholder="Escriba la especialidad médica"
        value={especialidad}
        onChange={handleChangeEspecialidad}
        maxLength="100"
        style={{ borderColor: especialidadError ? 'red' : 'inherit' }}
      />
      {especialidadError && <span style={{ color: 'red', fontSize: '12px' }}>{especialidadError}</span>}
      <br />

      <button type="submit" onClick={handleClick}>Agregar Médico</button>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        * Campos requeridos
      </p>
    </div>
  )
}

MedicoAdd_mantenimiento.propTypes = {
  lugarid: PropTypes.number,
}

MedicoAdd_mantenimiento.defaultProps = {
  lugarid: PropTypes.number,
}

export default MedicoAdd_mantenimiento
