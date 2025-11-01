import React from "react";
import PropTypes from "prop-types";

import { styles } from "./ShowAllTopMedicos.module.css";

const ShowAllTopMedicos = ({ json }) => {
  return (
    <div className={styles}>
      <table
        style={{
          width: "100%",
          border: "1px solid white",
        }}
      >
        <tr>
          <th>ID del Médico</th>
          <th>Nombre del Médico</th>
          <th>Cantidad de Pacientes Atendidos</th>
        </tr>

        {json.map((row) => {
          return (
            <tr key={row.medicoid}>
              <th>{row.medicoid}</th>
              <th>{row.medico_nombre}</th>
              <th>{row.total_visitas}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

ShowAllTopMedicos.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

ShowAllTopMedicos.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ShowAllTopMedicos;
