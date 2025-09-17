import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import BusquedaMensual from '../BusquedaMensual'
import Expediente from '../Expediente'

import { styles } from './InterfazMedico.module.css'

const InterfazMedico = () => {
  const location = useLocation()
  const { lugarid } = location.state

  const [busquedaMensual, setBusquedaMensual] = useState(true)
  const [expediente, setExpediente] = useState(false)

  const handleClickBusquedaMensual = async () => {
    setBusquedaMensual(true)
    setExpediente(false)
  }

  const handleClickExpediente = async () => {
    setBusquedaMensual(false)
    setExpediente(true)
  }

  return (
    <div className={styles}>
      <nav>
        <button type="submit" onClick={handleClickBusquedaMensual}>Busqueda Mensual</button>
        <button type="submit" onClick={handleClickExpediente}>Expediente</button>
      </nav>
      {
        busquedaMensual ? <BusquedaMensual lugarid={lugarid} /> : null
      }
      {
        expediente ? <Expediente /> : null
      }

    </div>
  )
}

export default InterfazMedico
