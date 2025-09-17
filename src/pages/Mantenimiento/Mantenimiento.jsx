import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import MedicoUpdateMantenimiento from '../MedicoUpdate_mantenimiento'
import MedicoAddMantenimiento from '../MedicoAdd_mantenimiento'
import PacienteAddMantenimiento from '../PacienteAdd_mantenimiento'
import PacienteUpdateMantenimiento from '../PacienteUpdate_mantenimiento'
import UsuarioUpdateMantenimiento from '../UsuarioUpdate_mantenimiento'
import UsuarioAddMantenimiento from '../UsuarioAdd_mantenimiento'
import Reportes from '../Reportes'
import { styles } from './Mantenimiento.module.css'

const Mantenimiento = () => {
  const location = useLocation()
  const lugarid = location.state

  const [updateMedico, setUpdateMedico] = useState(true)
  const [addMedico, setAddMedico] = useState(false)
  const [updateUsuario, setUpdateUsuario] = useState(false)
  const [addUsuario, setAddUsuario] = useState(false)
  const [updatePaciente, setUpdatePaciente] = useState(false)
  const [addPaciente, setAddPaciente] = useState(false)
  const [reporteria, setReporteria] = useState(false)

  const handleClickUpdateMedico = async () => {
    setUpdateMedico(true)
    setAddMedico(false)
    setUpdateUsuario(false)
    setAddUsuario(false)
    setUpdatePaciente(false)
    setAddPaciente(false)
    setReporteria(false)
  }

  const handleClickAddMedico = async () => {
    setUpdateMedico(false)
    setAddMedico(true)
    setUpdateUsuario(false)
    setAddUsuario(false)
    setUpdatePaciente(false)
    setAddPaciente(false)
    setReporteria(false)
  }

  const handleClickUpdateUsuario = async () => {
    setUpdateMedico(false)
    setAddMedico(false)
    setUpdateUsuario(true)
    setAddUsuario(false)
    setUpdatePaciente(false)
    setAddPaciente(false)
    setReporteria(false)
  }

  const handleClickAddUsuario = async () => {
    setUpdateMedico(false)
    setAddMedico(false)
    setUpdateUsuario(false)
    setAddUsuario(true)
    setUpdatePaciente(false)
    setAddPaciente(false)
    setReporteria(false)
  }

  const handleClickUpdatePaciente = async () => {
    setUpdateMedico(false)
    setAddMedico(false)
    setUpdateUsuario(false)
    setAddUsuario(false)
    setUpdatePaciente(true)
    setAddPaciente(false)
    setReporteria(false)
  }

  const handleClickAddPaciente = async () => {
    setUpdateMedico(false)
    setAddMedico(false)
    setUpdateUsuario(false)
    setAddUsuario(false)
    setUpdatePaciente(false)
    setAddPaciente(true)
    setReporteria(false)
  }

  const handleClickReporteria = async () => {
    setUpdateMedico(false)
    setAddMedico(false)
    setUpdateUsuario(false)
    setAddUsuario(false)
    setUpdatePaciente(false)
    setAddPaciente(false)
    setReporteria(true)
  }

  return (
    <div className={styles}>
      <nav>
        <button type="submit" onClick={handleClickUpdateMedico}>Actualizar Medico</button>
        <button type="submit" onClick={handleClickAddMedico}>Agregar Medico</button>
        <button type="submit" onClick={handleClickUpdateUsuario}>Actualizar Usuario</button>
        <button type="submit" onClick={handleClickAddUsuario}>Agregar Usuario</button>
        <button type="submit" onClick={handleClickUpdatePaciente}>Actualizar Paciente</button>
        <button type="submit" onClick={handleClickAddPaciente}>Agregar Paciente</button>
        <button type="submit" onClick={handleClickReporteria}>Reporteria</button>
      </nav>

      {
        addMedico ? <MedicoAddMantenimiento lugarid={lugarid} /> : null
      }
      {
        updateMedico ? <MedicoUpdateMantenimiento lugarid={lugarid} /> : null
      }

      {
        addUsuario ? <UsuarioAddMantenimiento lugid={lugarid} /> : null
      }
      {
        updateUsuario ? <UsuarioUpdateMantenimiento lugid={lugarid} /> : null
      }

      {
        addPaciente ? <PacienteAddMantenimiento /> : null
      }
      {
        updatePaciente ? <PacienteUpdateMantenimiento /> : null
      }
      {
        reporteria ? <Reportes /> : null
      }

    </div>
  )
}

export default Mantenimiento
