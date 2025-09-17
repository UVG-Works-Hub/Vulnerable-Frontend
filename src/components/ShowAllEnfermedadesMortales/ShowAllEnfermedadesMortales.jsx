import React from 'react'
import PropTypes from 'prop-types'

import { styles } from './ShowAllEnfermedadesMortales.module.css'

const ShowAllEnfermedadesMortales = ({ json }) => {
  return (
    <div className={styles}>
      <table style={{
        width: '100%',
        border: '1px solid white',
      }}
      >
        <tr>
          <th>Nombre</th>
          <th>Cantidad de Fallecidos</th>
        </tr>

        {json.map((row) => {
          return (
            <tr>
              <th>{row.nombre_enfermedad}</th>
              <th>{row.cantidad}</th>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

ShowAllEnfermedadesMortales.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

ShowAllEnfermedadesMortales.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default ShowAllEnfermedadesMortales
