import React from "react";
import PropTypes from "prop-types";

import { styles } from "./ShowAll.module.css";

const ShowAll = ({ json }) => {
  return (
    <div className={styles}>
      <table
        style={{
          width: "100%",
          border: "1px solid white",
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
            <tr key={row.medicoid}>
              <td>{row.medicoid}</td>
              <td>{row.nombre}</td>
              <td>{row.apellido}</td>
              <td>{row.direccion}</td>
              <td>{row.telefono}</td>
              <td>{row.numero_colegiado}</td>
              <td>{row.especialidad}</td>
              <td>{row.lugarid}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

ShowAll.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

ShowAll.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ShowAll;
