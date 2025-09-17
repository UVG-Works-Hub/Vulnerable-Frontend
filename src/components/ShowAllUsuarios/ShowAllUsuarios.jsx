import React from 'react'
import PropTypes from 'prop-types'

import { styles } from './ShowAllUsuarios.module.css'

const ShowAllUsuarios = ({ json }) => {
  return (
    <div className={styles}>
      <table style={{
        width: '100%',
        border: '1px solid white',
      }}
      >
        <tr>
          <th>ID del Usuario</th>
          <th>Tipo</th>
          <th>Correo</th>
          <th>Contraseña</th>
          <th>Numero de Colegiado</th>
          <th>ID del Lugar De Trabajo</th>
        </tr>

        {json.map((row) => {
          return (
            <tr>
              <th>{row.userid}</th>
              <th>{row.tipo}</th>
              <th>{row.correo}</th>
              <th>{row.contraseña}</th>
              <th>{row.num_colegiado}</th>
              <th>{row.lugarid}</th>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

ShowAllUsuarios.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

ShowAllUsuarios.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default ShowAllUsuarios
