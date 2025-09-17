import React, { useState } from 'react'
import Axios from 'axios'
import {
  ShowAllTopMedicos,
  ShowAllEnfermedadesMortales,
  ShowAllPacientesMasVisitas,
  ShowAllHospitalesMasPacientes,
} from '../../components'

import { styles } from './Reportes.module.css'

const Reportes = () => {
  const [responseData, setResponseData] = useState(null)
  const [responseData1, setResponseData1] = useState(null)
  const [responseData2, setResponseData2] = useState(null)
  const [responseData3, setResponseData3] = useState(null)
  const [show, setShow] = useState(false)

  const getTopMedicos = async () => {
    try {
      const response = await Axios.get('http://localhost:3000/api/v1/queries/top_medicos/')
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const loadTopMedicos = async () => {
    setResponseData(await getTopMedicos())
  }

  const getTopEnfermedades = async () => {
    try {
      const response = await Axios.get('http://localhost:3000/api/v1/queries/enfermedades_mortales/')
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const loadTopEnfermedades = async () => {
    setResponseData1(await getTopEnfermedades())
  }

  const getTopPacientes = async () => {
    try {
      const response = await Axios.get('http://localhost:3000/api/v1/queries/get_pacientesvisitas/')
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const loadTopPacientes = async () => {
    setResponseData2(await getTopPacientes())
  }

  const getTopHospitales = async () => {
    try {
      const response = await Axios.get('http://localhost:3000/api/v1/queries/top_hospitales/')
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const loadTopHospitales = async () => {
    setResponseData3(await getTopHospitales())
  }

  const handleClick = async () => {
    await loadTopMedicos()
    await loadTopEnfermedades()
    await loadTopPacientes()
    await loadTopHospitales()
    setShow(true)
  }

  return (
    <div className={styles}>
      <button type="submit" onClick={handleClick}>Ver reporte</button>
      <h2>Médicos que han atendido más pacientes</h2>
      {
        show ? <ShowAllTopMedicos json={responseData} /> : null
      }
      <h2>Enfermedades más mortales</h2>
      {
        show ? <ShowAllEnfermedadesMortales json={responseData1} /> : null
      }
      <h2>Pacientes que han visitado más una unidad de salud</h2>
      {
        show ? <ShowAllPacientesMasVisitas json={responseData2} /> : null
      }
      <h2>Hospitales que han atendido a más pacientes</h2>
      {
        show ? <ShowAllHospitalesMasPacientes json={responseData3} /> : null
      }
    </div>
  )
}

export default Reportes
