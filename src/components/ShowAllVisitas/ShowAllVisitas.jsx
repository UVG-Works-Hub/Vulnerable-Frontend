import React from 'react'
import PropTypes from 'prop-types'

import { styles } from './ShowAllVisitas.module.css'

const ShowAllVisitas = ({ json }) => {
  return (
    <div className={styles}>
      <table style={{
        width: '100%',
        border: '1px solid white',
      }}
      >
        <tr>
          <th>Nombre del paciente</th>
          <th>Fecha de Visita</th>
          <th>Hora de Visita</th>
          <th>Centro de Salud Visitado</th>
          <th>Médico Encargado</th>
          <th>Examen Realizado en Visita</th>
          <th>Nombre de la Enfermedad Tratada</th>
          <th>Medicamento Asignado</th>
          <th>Evolución</th>
        </tr>

        {json.map((row) => {
          return (
            <tr>
              <th>{row.nombre}</th>
              <th>{row.fecha}</th>
              <th>{row.hora}</th>
              <th>{row.lugar}</th>
              <th>{row.medico}</th>
              <th>{row.examen}</th>
              <th>{row.nombre_enfermedad}</th>
              <th>{row.medicamentos}</th>
              <th>{row.evolucion}</th>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

ShowAllVisitas.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

ShowAllVisitas.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default ShowAllVisitas
