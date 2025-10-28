import React from "react";
import PropTypes from "prop-types";

import { styles } from "./ShowAllBusquedaMensual.module.css";

const ShowAllBusquedaMensual = ({ json }) => {
  return (
    <div className={styles}>
      <table
        style={{
          width: "100%",
          border: "1px solid white",
        }}
      >
        <tr>
          <th>Recurso Médico</th>
          <th>Porcentaje Restante</th>
        </tr>

        {json.map((row) => {
          return (
            <tr key={row.id}>
              <th>{row.tipo}</th>
              <th>{row.porcentaje_restante}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

ShowAllBusquedaMensual.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

ShowAllBusquedaMensual.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ShowAllBusquedaMensual;
