import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { ShowAllPacientes } from '../../components'

import { styles } from './PacienteUpdate_mantenimiento.module.css'
import { validateAndSanitize, isValidDPI } from '../../utils/sanitizer'

const PacienteUpdate_mantenimiento = () => {
  const [responseData, setResponseData] = useState(null)
  const [dpi, setDPI] = useState('')
  const [data, setData] = useState('')
  const [dpiError, setDpiError] = useState('')
  const [dataError, setDataError] = useState('')

  const handleChangeNum = (valor) => {
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

  const getPacientes = async () => {
    try {
      const response = await Axios.get('http://localhost:3000/api/v1/pacientes/')
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const loadPacientes = async () => {
    setResponseData(await getPacientes())
  }

  const updateName = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar nombre (requerido, máximo 100 caracteres, seguridad estricta)
      const nameValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      })

      if (!nameValidation.isValid) {
        throw new Error(nameValidation.error)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/nombre/${dpiValidation.sanitizedValue}`, {
        nombre: nameValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickName = async () => {
    try {
      await updateName()
      await loadPacientes()
      alert('Nombre actualizado exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateApellido = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar apellido (requerido, máximo 100 caracteres, seguridad estricta)
      const apellidoValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      })

      if (!apellidoValidation.isValid) {
        throw new Error(apellidoValidation.error)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/apellido/${dpiValidation.sanitizedValue}`, {
        apellido: apellidoValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickApellido = async () => {
    try {
      await updateApellido()
      await loadPacientes()
      alert('Apellido actualizado exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateDireccion = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar dirección (requerida, máximo 200 caracteres)
      const direccionValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 200,
      })

      if (!direccionValidation.isValid) {
        throw new Error(direccionValidation.error)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/direccion/${dpiValidation.sanitizedValue}`, {
        direccion: direccionValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickDireccion = async () => {
    try {
      await updateDireccion()
      await loadPacientes()
      alert('Dirección actualizada exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateTelefono = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar teléfono (requerido, formato de teléfono)
      const telefonoValidation = validateAndSanitize(data, {
        required: true,
        type: 'phone',
        maxLength: 15,
      })

      if (!telefonoValidation.isValid) {
        throw new Error(telefonoValidation.error)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/telefono/${dpiValidation.sanitizedValue}`, {
        telefono: telefonoValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickTelefono = async () => {
    try {
      await updateTelefono()
      await loadPacientes()
      alert('Teléfono actualizado exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateMasaCorporal = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar masa corporal (número positivo, máximo 10 caracteres)
      const masaValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseFloat(value) > 0 },
      })

      if (!masaValidation.isValid) {
        throw new Error(masaValidation.error || 'Debe ser un número positivo')
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/masa-corporal/${dpiValidation.sanitizedValue}`, {
        masa_corporal: masaValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickMasaCorporal = async () => {
    try {
      await updateMasaCorporal()
      await loadPacientes()
      alert('Masa corporal actualizada exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateAltura = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar altura (número positivo, máximo 10 caracteres)
      const alturaValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseFloat(value) > 0 },
      })

      if (!alturaValidation.isValid) {
        throw new Error(alturaValidation.error || 'Debe ser un número positivo')
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/altura/${dpiValidation.sanitizedValue}`, {
        altura: alturaValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickAltura = async () => {
    try {
      await updateAltura()
      await loadPacientes()
      alert('Altura actualizada exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updatePeso = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar peso (número positivo, máximo 10 caracteres)
      const pesoValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 10,
        customValidator: (value) => { return !Number.isNaN(value) && parseFloat(value) > 0 },
      })

      if (!pesoValidation.isValid) {
        throw new Error(pesoValidation.error || 'Debe ser un número positivo')
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/peso/${dpiValidation.sanitizedValue}`, {
        peso: pesoValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickPeso = async () => {
    try {
      await updatePeso()
      await loadPacientes()
      alert('Peso actualizado exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateAdiccion = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar adicciones (texto, máximo 500 caracteres)
      const adiccionValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 500,
      })

      if (!adiccionValidation.isValid) {
        throw new Error(adiccionValidation.error)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/adicciones/${dpiValidation.sanitizedValue}`, {
        adicciones: adiccionValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickAdiccion = async () => {
    try {
      await updateAdiccion()
      await loadPacientes()
      alert('Adicciones actualizadas exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateEvolucion = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar evolución (texto médico, máximo 1000 caracteres)
      const evolucionValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 1000,
      })

      if (!evolucionValidation.isValid) {
        throw new Error(evolucionValidation.error)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/evolucion/${dpiValidation.sanitizedValue}`, {
        evolucion: evolucionValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickEvolucion = async () => {
    try {
      await updateEvolucion()
      await loadPacientes()
      alert('Evolución actualizada exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const updateStatus = async () => {
    try {
      // Validar y sanitizar DPI
      const dpiValidation = validateAndSanitize(dpi, {
        required: true,
        type: 'dpi',
        maxLength: 13,
      })

      if (!dpiValidation.isValid) {
        throw new Error(dpiValidation.error)
      }

      // Validar y sanitizar status (texto, máximo 50 caracteres, seguridad estricta)
      const statusValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 50,
        strictSecurity: true,
        allowSpecialChars: true,
      })

      if (!statusValidation.isValid) {
        throw new Error(statusValidation.error)
      }

      const response = await Axios.put(`http://localhost:3000/api/v1/pacientes/status/${dpiValidation.sanitizedValue}`, {
        status: statusValidation.sanitizedValue,
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Hubo un error')
    }
  }

  const handleClickStatus = async () => {
    try {
      await updateStatus()
      await loadPacientes()
      alert('Status actualizado exitosamente')
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  useEffect(() => {
    loadPacientes()
  }, [])

  if (!responseData) {
    return 'Loading...'
  }

  return (
    <div className={styles}>
      <ShowAllPacientes json={responseData} />
      <h2>DPI *</h2>
      <input
        type="text"
        placeholder="DPI"
        value={dpi}
        onChange={handleChangeNum}
        maxLength="13"
        pattern="\d{13}"
        style={{ borderColor: dpiError ? 'red' : 'inherit' }}
      />
      {dpiError && <span style={{ color: 'red', fontSize: '12px' }}>{dpiError}</span>}

      <br />
      <h2>Cambiar nombre</h2>
      <br />
      <input
        type="text"
        placeholder="Escriba el nuevo nombre"
        value={data}
        onChange={handleChangeData}
        maxLength="100"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickName}>Cambiar</button>

      <h2>Cambiar apellido</h2>
      <br />
      <input
        type="text"
        placeholder="Escriba el nuevo apellido"
        value={data}
        onChange={handleChangeData}
        maxLength="100"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickApellido}>Cambiar</button>

      <h2>Cambiar direccion</h2>
      <br />
      <textarea
        placeholder="Escriba la nueva direccion"
        value={data}
        onChange={handleChangeData}
        maxLength="200"
        rows="3"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickDireccion}>Cambiar</button>

      <h2>Cambiar telefono</h2>
      <br />
      <input
        type="tel"
        placeholder="Escriba el nuevo telefono"
        value={data}
        onChange={handleChangeData}
        maxLength="15"
        pattern="[0-9+\-\s()]{10,15}"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickTelefono}>Cambiar</button>

      <h2>Cambiar Masa Corporal</h2>
      <br />
      <input
        type="number"
        placeholder="Escriba la nueva masa corporal"
        value={data}
        onChange={handleChangeData}
        maxLength="10"
        min="0"
        step="0.01"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickMasaCorporal}>Cambiar</button>

      <h2>Cambiar Altura</h2>
      <br />
      <input
        type="number"
        placeholder="Escriba la nueva altura (cm)"
        value={data}
        onChange={handleChangeData}
        maxLength="10"
        min="0"
        step="0.01"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickAltura}>Cambiar</button>

      <h2>Cambiar Peso</h2>
      <br />
      <input
        type="number"
        placeholder="Escriba el nuevo peso (kg)"
        value={data}
        onChange={handleChangeData}
        maxLength="10"
        min="0"
        step="0.01"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickPeso}>Cambiar</button>

      <h2>Cambiar Adicción</h2>
      <br />
      <textarea
        placeholder="Escriba las adicciones del paciente"
        value={data}
        onChange={handleChangeData}
        maxLength="500"
        rows="4"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickAdiccion}>Cambiar</button>

      <h2>Cambiar Evolucion</h2>
      <br />
      <textarea
        placeholder="Escriba la evolución médica del paciente"
        value={data}
        onChange={handleChangeData}
        maxLength="1000"
        rows="6"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickEvolucion}>Cambiar</button>

      <h2>Cambiar Estatus</h2>
      <br />
      <input
        type="text"
        placeholder="Escriba el nuevo estatus"
        value={data}
        onChange={handleChangeData}
        maxLength="50"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickStatus}>Cambiar</button>
    </div>
  )
}

export default PacienteUpdate_mantenimiento
