import React from 'react'
import PropTypes from 'prop-types'

import { styles } from './ShowAllLugaresVisitados.module.css'

const ShowAllLugaresVisitados = ({ json }) => {
  return (
    <div className={styles}>
      <table style={{
        width: '100%',
        border: '1px solid white',
      }}
      >
        <tr>
          <th>Nombre del Hospital visitado</th>
          <th>Fecha de Visita</th>
          <th>Hora de Visita</th>
        </tr>

        {json.map((row) => {
          return (
            <tr>
              <th>{row.nombre}</th>
              <th>{row.fecha}</th>
              <th>{row.hora}</th>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

ShowAllLugaresVisitados.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

ShowAllLugaresVisitados.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default ShowAllLugaresVisitados
