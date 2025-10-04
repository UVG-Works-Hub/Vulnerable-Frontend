import React, { useState } from 'react'
import Axios from 'axios'

import { styles } from './PacienteAdd_mantenimiento.module.css'
import {
  validateAndSanitize, isValidDPI, isValidPhone,
} from '../../utils/sanitizer'

const PacienteAdd_mantenimiento = () => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [masa_corporal, setMasa_corporal] = useState('')
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [adicciones, setAdicciones] = useState('')
  const [evolucion, setEvolucion] = useState('')
  const [status, setStatus] = useState('')
  const [dpi, setDPI] = useState('')

  // Estados para errores de validación
  const [nombreError, setNombreError] = useState('')
  const [apellidoError, setApellidoError] = useState('')
  const [direccionError, setDireccionError] = useState('')
  const [telefonoError, setTelefonoError] = useState('')
  const [masaError, setMasaError] = useState('')
  const [alturaError, setAlturaError] = useState('')
  const [pesoError, setPesoError] = useState('')
  const [adiccionesError, setAdiccionesError] = useState('')
  const [evolucionError, setEvolucionError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [dpiError, setDpiError] = useState('')

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

  const handleChangeMasa = (valor) => {
    const { value } = valor.target
    setMasa_corporal(value)

    // Validar número positivo en tiempo real
    if (value.trim() === '') {
      setMasaError('')
    } else if (Number.isNaN(value) || parseFloat(value) <= 0) {
      setMasaError('Debe ser un número positivo')
    } else {
      setMasaError('')
    }
  }

  const handleChangeAltura = (valor) => {
    const { value } = valor.target
    setAltura(value)

    // Validar número positivo en tiempo real
    if (value.trim() === '') {
      setAlturaError('')
    } else if (Number.isNaN(value) || parseFloat(value) <= 0) {
      setAlturaError('Debe ser un número positivo')
    } else {
      setAlturaError('')
    }
  }

  const handleChangePeso = (valor) => {
    const { value } = valor.target
    setPeso(value)

    // Validar número positivo en tiempo real
    if (value.trim() === '') {
      setPesoError('')
    } else if (Number.isNaN(value) || parseFloat(value) <= 0) {
      setPesoError('Debe ser un número positivo')
    } else {
      setPesoError('')
    }
  }

  const handleChangeAdicciones = (valor) => {
    const { value } = valor.target
    setAdicciones(value)

    // Validar longitud en tiempo real (máximo 500 caracteres)
    if (value.length > 500) {
      setAdiccionesError('Máximo 500 caracteres')
    } else {
      setAdiccionesError('')
    }
  }

  const handleChangeEvolucion = (valor) => {
    const { value } = valor.target
    setEvolucion(value)

    // Validar longitud en tiempo real (máximo 1000 caracteres)
    if (value.length > 1000) {
      setEvolucionError('Máximo 1000 caracteres')
    } else {
      setEvolucionError('')
    }
  }

  const handleChangeStatus = (valor) => {
    const { value } = valor.target
    setStatus(value)

    // Validar longitud en tiempo real (máximo 50 caracteres)
    if (value.length > 50) {
      setStatusError('Máximo 50 caracteres')
    } else {
      setStatusError('')
    }
  }

  const handleChangeDPI = (valor) => {
    const { value } = valor.target
    setDPI(value)

    // Validar DPI en tiempo real
    if (value.trim() === '') {
      setDpiError('')
    } else if (!isValidDPI(value)) {
      setDpiError('DPI debe tener exactamente 13 dígitos')
    } else {
      setDpiError('')
    }
  }

  const agregarPaciente = async () => {
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

      // Validar y sanitizar teléfono (requerido, formato de teléfono)
      const telefonoValidation = validateAndSanitize(telefono, {
        required: true,
        type: 'phone',
        maxLength: 15,
      })

      if (!telefonoValidation.isValid) {
        throw new Error(`Teléfono: ${telefonoValidation.error}`)
      }

      // Validar y sanitizar dirección (requerida, máximo 200 caracteres)
      const direccionValidation = validateAndSanitize(direccion, {
        required: true,
        maxLength: 200,
      })

      if (!direccionValidation.isValid) {
        throw new Error(`Dirección: ${direccionValidation.error}`)
      }

      // Validar y sanitizar masa corporal (número positivo, máximo 10 caracteres)
      const masaValidation = validateAndSanitize(masa_corporal, {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseFloat(value) > 0 },
      })

      if (!masaValidation.isValid) {
        throw new Error(`Masa corporal: ${masaValidation.error || 'Debe ser un número positivo'}`)
      }

      // Validar y sanitizar altura (número positivo, máximo 10 caracteres)
      const alturaValidation = validateAndSanitize(altura, {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseFloat(value) > 0 },
      })

      if (!alturaValidation.isValid) {
        throw new Error(`Altura: ${alturaValidation.error || 'Debe ser un número positivo'}`)
      }

      // Validar y sanitizar peso (número positivo, máximo 10 caracteres)
      const pesoValidation = validateAndSanitize(peso, {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseFloat(value) > 0 },
      })

      if (!pesoValidation.isValid) {
        throw new Error(`Peso: ${pesoValidation.error || 'Debe ser un número positivo'}`)
      }

      // Validar y sanitizar adicciones (texto, máximo 500 caracteres)
      const adiccionesValidation = validateAndSanitize(adicciones, {
        required: true,
        maxLength: 500,
      })

      if (!adiccionesValidation.isValid) {
        throw new Error(`Adicciones: ${adiccionesValidation.error}`)
      }

      // Validar y sanitizar evolución (texto médico, máximo 1000 caracteres)
      const evolucionValidation = validateAndSanitize(evolucion, {
        required: true,
        maxLength: 1000,
      })

      if (!evolucionValidation.isValid) {
        throw new Error(`Evolución: ${evolucionValidation.error}`)
      }

      // Validar y sanitizar status (texto, máximo 50 caracteres, seguridad estricta)
      const statusValidation = validateAndSanitize(status, {
        required: true,
        maxLength: 50,
        strictSecurity: true,
        allowSpecialChars: true,
      })

      if (!statusValidation.isValid) {
        throw new Error(`Status: ${statusValidation.error}`)
      }

      // Validar y sanitizar DPI (requerido, formato de DPI)
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(`DPI: ${dpiValidation.error}`)
      }

      const response = await Axios.post(`http://localhost:3000/api/v1/pacientes/${nombreValidation.sanitizedValue}&${apellidoValidation.sanitizedValue}&${telefonoValidation.sanitizedValue}&${direccionValidation.sanitizedValue}&${masaValidation.sanitizedValue}&${alturaValidation.sanitizedValue}&${pesoValidation.sanitizedValue}&${adiccionesValidation.sanitizedValue}&${evolucionValidation.sanitizedValue}&${statusValidation.sanitizedValue}&${dpiValidation.sanitizedValue}`)
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClick = async () => {
    try {
      await agregarPaciente()
      alert('Paciente agregado exitosamente')

      // Limpiar formulario después de éxito
      setNombre('')
      setApellido('')
      setDireccion('')
      setTelefono('')
      setMasa_corporal('')
      setAltura('')
      setPeso('')
      setAdicciones('')
      setEvolucion('')
      setStatus('')
      setDPI('')

      // Limpiar errores
      setNombreError('')
      setApellidoError('')
      setDireccionError('')
      setTelefonoError('')
      setMasaError('')
      setAlturaError('')
      setPesoError('')
      setAdiccionesError('')
      setEvolucionError('')
      setStatusError('')
      setDpiError('')
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

      <h2>Masa Corporal *</h2>
      <input
        type="number"
        placeholder="Escriba la masa corporal (kg)"
        value={masa_corporal}
        onChange={handleChangeMasa}
        maxLength="10"
        min="0"
        step="0.01"
        style={{ borderColor: masaError ? 'red' : 'inherit' }}
      />
      {masaError && <span style={{ color: 'red', fontSize: '12px' }}>{masaError}</span>}
      <br />

      <h2>Altura *</h2>
      <input
        type="number"
        placeholder="Escriba la altura (cm)"
        value={altura}
        onChange={handleChangeAltura}
        maxLength="10"
        min="0"
        step="0.01"
        style={{ borderColor: alturaError ? 'red' : 'inherit' }}
      />
      {alturaError && <span style={{ color: 'red', fontSize: '12px' }}>{alturaError}</span>}
      <br />

      <h2>Peso *</h2>
      <input
        type="number"
        placeholder="Escriba el peso (kg)"
        value={peso}
        onChange={handleChangePeso}
        maxLength="10"
        min="0"
        step="0.01"
        style={{ borderColor: pesoError ? 'red' : 'inherit' }}
      />
      {pesoError && <span style={{ color: 'red', fontSize: '12px' }}>{pesoError}</span>}
      <br />

      <h2>Adicciones *</h2>
      <textarea
        placeholder="Escriba las adicciones del paciente (ej: Ninguna, Alcohol, Tabaco, etc.)"
        value={adicciones}
        onChange={handleChangeAdicciones}
        maxLength="500"
        rows="4"
        style={{ borderColor: adiccionesError ? 'red' : 'inherit' }}
      />
      {adiccionesError && <span style={{ color: 'red', fontSize: '12px' }}>{adiccionesError}</span>}
      <br />

      <h2>Evolución *</h2>
      <textarea
        placeholder="Escriba la evolución médica del paciente (historial médico, tratamientos, etc.)"
        value={evolucion}
        onChange={handleChangeEvolucion}
        maxLength="1000"
        rows="6"
        style={{ borderColor: evolucionError ? 'red' : 'inherit' }}
      />
      {evolucionError && <span style={{ color: 'red', fontSize: '12px' }}>{evolucionError}</span>}
      <br />

      <h2>Status *</h2>
      <input
        type="text"
        placeholder="Escriba el estatus (ej: Activo, Inactivo, En tratamiento)"
        value={status}
        onChange={handleChangeStatus}
        maxLength="50"
        style={{ borderColor: statusError ? 'red' : 'inherit' }}
      />
      {statusError && <span style={{ color: 'red', fontSize: '12px' }}>{statusError}</span>}
      <br />

      <h2>DPI *</h2>
      <input
        type="text"
        placeholder="Escriba el DPI (13 dígitos)"
        value={dpi}
        onChange={handleChangeDPI}
        maxLength="13"
        pattern="\d{13}"
        style={{ borderColor: dpiError ? 'red' : 'inherit' }}
      />
      {dpiError && <span style={{ color: 'red', fontSize: '12px' }}>{dpiError}</span>}
      <br />

      <button type="submit" onClick={handleClick}>Agregar Paciente</button>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        * Campos requeridos
      </p>
    </div>
  )
}

export default PacienteAdd_mantenimiento
