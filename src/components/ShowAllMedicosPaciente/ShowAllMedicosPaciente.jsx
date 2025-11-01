import React from "react";
import PropTypes from "prop-types";

import { styles } from "./ShowAllMedicosPaciente.module.css";

const ShowAllMedicosPaciente = ({ json }) => {
  return (
    <div className={styles}>
      <table
        style={{
          width: "100%",
          border: "1px solid white",
        }}
      >
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Numero de colegiado</th>
          <th>Especialidad</th>
        </tr>

        {json.map((row) => {
          return (
            <tr key={row.numero_colegiado}>
              <th>{row.nombre}</th>
              <th>{row.apellido}</th>
              <th>{row.numero_colegiado}</th>
              <th>{row.especialidad}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

ShowAllMedicosPaciente.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

ShowAllMedicosPaciente.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ShowAllMedicosPaciente;
