import React from "react";
import PropTypes from "prop-types";

import { styles } from "./ShowAllMedicamentos.module.css";

const ShowAllMedicamentos = ({ json }) => {
  return (
    <div className={styles}>
      <table
        style={{
          width: "100%",
          border: "px solid white",
        }}
      >
        <tr>
          <th>Fecha donde asignaron medicamento</th>
          <th>Medicamento</th>
          <th>Evolución</th>
        </tr>

        {json.map((row) => {
          return (
            <tr key={row.fecha}>
              <th>{row.fecha}</th>
              <th>{row.medicamentos}</th>
              <th>{row.evolucion}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

ShowAllMedicamentos.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

ShowAllMedicamentos.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ShowAllMedicamentos;
