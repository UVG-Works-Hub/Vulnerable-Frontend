import React from 'react'
import PropTypes from 'prop-types'

import { styles } from './ShowAllHospitalesMasPacientes.module.css'

const ShowAllHospitalesMasPacientes = ({ json }) => {
  return (
    <div className={styles}>
      <table style={{
        width: '100%',
        border: '1px solid white',
      }}
      >
        <tr>
          <th>Nombre de la Unidad de Salud</th>
          <th>Cantidad Pacientes Atendidos</th>
        </tr>

        {json.map((row) => {
          return (
            <tr>
              <th>{row.nombre}</th>
              <th>{row.total_pacientes}</th>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

ShowAllHospitalesMasPacientes.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

ShowAllHospitalesMasPacientes.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default ShowAllHospitalesMasPacientes
