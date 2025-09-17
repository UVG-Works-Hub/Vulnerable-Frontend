import React, { useState } from 'react'
import Axios from 'axios'

import { styles } from './PacienteAdd_mantenimiento.module.css'

const PacienteAdd_mantenimiento = () => {
  const [nombre, setNombre] = useState(null)
  const [apellido, setApellido] = useState(null)
  const [direccion, setDireccion] = useState(null)
  const [telefono, setTelefono] = useState(null)
  const [masa_corporal, setMasa_corporal] = useState(null)
  const [altura, setAltura] = useState(null)
  const [peso, setPeso] = useState(null)
  const [adicciones, setAdicciones] = useState(null)
  const [evolucion, setEvolucion] = useState(null)
  const [status, setStatus] = useState(null)
  const [dpi, setDPI] = useState(null)

  const handleChangeNombre = (valor) => {
    // 👇 Store the input value to local state
    setNombre(valor.target.value)
  }

  const handleChangeApellido = (valor) => {
    // 👇 Store the input value to local state
    setApellido(valor.target.value)
  }

  const handleChangeDireccion = (valor) => {
    // 👇 Store the input value to local state
    setDireccion(valor.target.value)
  }

  const handleChangeTelefono = (valor) => {
    // 👇 Store the input value to local state
    setTelefono(valor.target.value)
  }

  const handleChangeMasa = (valor) => {
    // 👇 Store the input value to local state
    setMasa_corporal(valor.target.value)
  }

  const handleChangeAltura = (valor) => {
    // 👇 Store the input value to local state
    setAltura(valor.target.value)
  }

  const handleChangePeso = (valor) => {
    // 👇 Store the input value to local state
    setPeso(valor.target.value)
  }

  const handleChangeAdicciones = (valor) => {
    // 👇 Store the input value to local state
    setAdicciones(valor.target.value)
  }

  const handleChangeEvolucion = (valor) => {
    // 👇 Store the input value to local state
    setEvolucion(valor.target.value)
  }

  const handleChangeStatus = (valor) => {
    // 👇 Store the input value to local state
    setStatus(valor.target.value)
  }

  const handleChangeDPI = (valor) => {
    // 👇 Store the input value to local state
    setDPI(valor.target.value)
  }

  const agregarPaciente = async () => {
    try {
      const response = await Axios.post(`http://localhost:3000/api/v1/pacientes/${nombre}&${apellido}&${telefono}&${direccion}&${masa_corporal}&${altura}&${peso}&${adicciones}&${evolucion}&${status}&${dpi}`)
      return response.data
    } catch (error) {
      return 'Hubo un error'
    }
  }

  const handleClick = async () => {
    await agregarPaciente()
  }

  return (
    <div className={styles}>
      <h2>Nombre</h2>
      <input type="text" placeholder="Escriba el nombre" onChange={handleChangeNombre} />
      <br />

      <h2>Apellido</h2>
      <input type="text" placeholder="Escriba el apellido" onChange={handleChangeApellido} />
      <br />

      <h2>Direccion</h2>
      <input type="text" placeholder="Escriba la direccion" onChange={handleChangeDireccion} />
      <br />

      <h2>Telefono</h2>
      <input type="text" placeholder="Escriba el telefono" onChange={handleChangeTelefono} />
      <br />

      <h2>Masa Corporal</h2>
      <input type="text" placeholder="Escriba la masa corporal" onChange={handleChangeMasa} />
      <br />

      <h2>Altura</h2>
      <input type="text" placeholder="Escriba la altura" onChange={handleChangeAltura} />
      <br />

      <h2>Peso</h2>
      <input type="text" placeholder="Escriba el peso" onChange={handleChangePeso} />
      <br />

      <h2>Adicciones</h2>
      <input type="text" placeholder="Escriba las adicciones" onChange={handleChangeAdicciones} />
      <br />

      <h2>Evolución</h2>
      <input type="text" placeholder="Escriba la evolución del paciente" onChange={handleChangeEvolucion} />
      <br />

      <h2>Status</h2>
      <input type="text" placeholder="Escriba el status" onChange={handleChangeStatus} />
      <br />

      <h2>DPI</h2>
      <input type="text" placeholder="Escriba el DPI" onChange={handleChangeDPI} />
      <br />

      <button type="submit" onClick={handleClick}>Agregar</button>
    </div>
  )
}

export default PacienteAdd_mantenimiento
