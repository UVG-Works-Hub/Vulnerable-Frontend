import React from 'react'
import PropTypes from 'prop-types'

import { styles } from './ShowAll.module.css'

const ShowAll = ({ json }) => {
  return (
    <div className={styles}>
      <table style={{
        width: '100%',
        border: '1px solid white',
      }}
      >
        <tr>
          <th>ID del Medico</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Direccion</th>
          <th>Telefono</th>
          <th>Numero de Colegiado</th>
          <th>Especialidad</th>
          <th>ID del Lugar De Trabajo</th>
        </tr>

        {json.map((row) => {
          return (
            <tr>
              <th>{row.medicoid}</th>
              <th>{row.nombre}</th>
              <th>{row.apellido}</th>
              <th>{row.direccion}</th>
              <th>{row.telefono}</th>
              <th>{row.numero_colegiado}</th>
              <th>{row.especialidad}</th>
              <th>{row.lugarid}</th>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

ShowAll.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

ShowAll.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default ShowAll
