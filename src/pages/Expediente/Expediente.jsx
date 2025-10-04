import React, { useState } from 'react'
import Axios from 'axios'

import {
  ShowAllPacientes,
  ShowAllExamenes,
  ShowAllCirugias,
  ShowAllMedicosPaciente,
  ShowAllMedicamentos,
  ShowAllLugaresVisitados,
  ShowAllVisitas,
} from '../../components'
import { styles, inputs, bloques } from './Expediente.module.css'
import { sanitizeHTML } from '../../utils/sanitizer'

const Expediente = () => {
  const [responseData, setResponseData] = useState(null)
  const [visitas, setVisitas] = useState(null)
  const [examenes, setExamenes] = useState(null)
  const [cirugias, setCirugias] = useState(null)
  const [medicos, setMedicos] = useState(null)
  const [medicamentos, setMedicamentos] = useState(null)
  const [lugaresVisitados, setLugaresVisitados] = useState(null)
  const [inputText, setInputText] = useState('')
  const [show, setShow] = useState(false)

  const getPacientesByDPI = async (dpi) => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/pacientes/${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const getVisitas = async (dpi) => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/visitas/get_visitas_especific/${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const getExamenes = async (dpi) => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/visitas/get_examenes/${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const getCirugias = async (dpi) => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/visitas/get_cirugias/${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const getMedicos = async (dpi) => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/visitas/get_medicosOfPaciente/${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const getMedicamentos = async (dpi) => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/visitas/get_medicamentosYevolucion/${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const getLugaresVisitados = async (dpi) => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/visitas/get_lugares_visitados/${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleChange = (valor) => {
    // 👇 Store the input value to local state
    setInputText(valor.target.value)
  }

  const handleClick = async () => {
    // Sanitizar el DPI antes de usarlo en consultas
    const sanitizedDPI = sanitizeHTML(inputText)

    // Actualizar todas las funciones para usar el DPI sanitizado
    const pacienteData = await getPacientesByDPI(sanitizedDPI)
    const visitasData = await getVisitas(sanitizedDPI)
    const examenesData = await getExamenes(sanitizedDPI)
    const cirugiasData = await getCirugias(sanitizedDPI)
    const medicosData = await getMedicos(sanitizedDPI)
    const medicamentosData = await getMedicamentos(sanitizedDPI)
    const lugaresData = await getLugaresVisitados(sanitizedDPI)

    setResponseData(pacienteData)
    setVisitas(visitasData)
    setExamenes(examenesData)
    setCirugias(cirugiasData)
    setMedicos(medicosData)
    setMedicamentos(medicamentosData)
    setLugaresVisitados(lugaresData)

    setShow(true)
  }

  return (
    <div className={styles}>
      <div className={inputs}>
        <input type="text" onChange={handleChange} placeholder="Ingrese el dpi del paciente" />
        <button type="submit" onClick={handleClick}>Submit</button>
      </div>
      <div className={bloques}>
        <h2>Datos Paciente</h2>
        {
          show ? <ShowAllPacientes json={responseData} /> : null
        }
        <h2>Visitas Completas del Paciente</h2>
        {
          show ? <ShowAllVisitas json={visitas} /> : null
        }
        <h2>Examenes Paciente</h2>
        {
          show ? <ShowAllExamenes json={examenes} /> : null
        }
        <h2>Cirugías practicadas</h2>
        {
          show ? <ShowAllCirugias json={cirugias} /> : null
        }
        <h2>Medicos que trataron al paciente</h2>
        {
          show ? <ShowAllMedicosPaciente json={medicos} /> : null
        }
        <h2>Medicamentos y evolucion</h2>
        {
          show ? <ShowAllMedicamentos json={medicamentos} /> : null
        }
        <h2>Centros de Salud Visitados</h2>
        {
          show ? <ShowAllLugaresVisitados json={lugaresVisitados} /> : null
        }
      </div>
    </div>
  )
}

export default Expediente
