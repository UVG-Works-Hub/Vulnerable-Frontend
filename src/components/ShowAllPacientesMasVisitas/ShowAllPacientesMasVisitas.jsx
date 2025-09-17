import React from 'react'
import PropTypes from 'prop-types'

import { styles } from './ShowAllPacientesMasVisitas.module.css'

const ShowAllPacientesMasVisitas = ({ json }) => {
  return (
    <div className={styles}>
      <table style={{
        width: '100%',
        border: '1px solid white',
      }}
      >
        <tr>
          <th>Nombre Paciente</th>
          <th>Cantidad de Visitas Realizadas</th>
        </tr>

        {json.map((row) => {
          return (
            <tr>
              <th>{row.nombre}</th>
              <th>{row.num_pacientes}</th>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

ShowAllPacientesMasVisitas.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}
ShowAllPacientesMasVisitas.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default ShowAllPacientesMasVisitas
