import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import PropTypes from 'prop-types'
import { ShowAll } from '@components'

import { styles } from './MedicoUpdate_mantenimiento.module.css'

const MedicoUpdate_mantenimiento = ({ lugarid }) => {
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

  const getMedicosBylugarid = async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/api/v1/medicos/by_lugarid/${lugarid}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const loadMedicos = async () => {
    setResponseData(await getMedicosBylugarid())
  }

  const updateName = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/medicos/cambiar_nombre/${num_colegiado}&${data}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickName = async () => {
    await updateName()
    await loadMedicos()
  }

  const updateApellido = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/medicos/cambiar_apellido/${num_colegiado}&${data}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickApellido = async () => {
    await updateApellido()
    await loadMedicos()
  }

  const updateDireccion = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/medicos/cambiar_direccion/${num_colegiado}&${data}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickDireccion = async () => {
    await updateDireccion()
    await loadMedicos()
  }

  const updateTelefono = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/medicos/cambiar_telefono/${num_colegiado}&${data}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickTelefono = async () => {
    await updateTelefono()
    await loadMedicos()
  }

  const updateEspecialidad = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/medicos/cambiar_especialidad/${num_colegiado}&${data}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickEspecialidad = async () => {
    await updateEspecialidad()
    await loadMedicos()
  }

  const updateLugarId = async () => {
    try {
      const response = await Axios.put(`http://localhost:3000/api/v1/medicos/cambiar_lugarid/${num_colegiado}&${data}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClickLugarId = async () => {
    await updateLugarId()
    await loadMedicos()
  }

  useEffect(() => {
    loadMedicos()
  }, [])

  if (!responseData) {
    return 'Loading...'
  }

  return (
    <div className={styles}>
      <ShowAll json={responseData} />
      <h2>Cambiar nombre</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba el nuevo nombre" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickName}>Cambiar</button>

      <h2>Cambiar apellido</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba el nuevo apellido" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickApellido}>Cambiar</button>

      <h2>Cambiar direccion</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba la nueva direccion" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickDireccion}>Cambiar</button>

      <h2>Cambiar telefono</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba el nuevo telefono" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickTelefono}>Cambiar</button>

      <h2>Cambiar especialidad</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba la nueva especialidad" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickEspecialidad}>Cambiar</button>

      <h2>Cambiar lugarid</h2>
      <input type="text" placeholder="Escriba el numero de colegiado" onChange={handleChangeNum} />
      <br />
      <input type="text" placeholder="Escriba la nueva id del lugar" onChange={handleChangeData} />
      <br />
      <button type="submit" onClick={handleClickLugarId}>Cambiar</button>
    </div>
  )
}

MedicoUpdate_mantenimiento.propTypes = {
  lugarid: PropTypes.number,
}

MedicoUpdate_mantenimiento.defaultProps = {
  lugarid: PropTypes.number,
}

export default MedicoUpdate_mantenimiento
