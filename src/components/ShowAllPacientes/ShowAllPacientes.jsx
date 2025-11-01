import React from "react";
import PropTypes from "prop-types";

import { styles } from "./ShowAllPacientes.module.css";

const ShowAllPacientes = ({ json }) => {
  return (
    <div className={styles}>
      <table
        style={{
          width: "100%",
          border: "1px solid white",
        }}
      >
        <tr>
          <th>ID del Paciente</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Masa Corportal</th>
          <th>Altura</th>
          <th>Peso</th>
          <th>Adicción</th>
          <th>Evolución</th>
          <th>Status</th>
          <th>DPI</th>
        </tr>

        {json.map((row) => {
          return (
            <tr key={row.pacienteid}>
              <th>{row.pacienteid}</th>
              <th>{row.nombre}</th>
              <th>{row.apellido}</th>
              <th>{row.telefono}</th>
              <th>{row.direccion}</th>
              <th>{row.masa_corporal}</th>
              <th>{row.altura}</th>
              <th>{row.peso}</th>
              <th>{row.adicciones}</th>
              <th>{row.evoluciones}</th>
              <th>{row.status}</th>
              <th>{row.dpi}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

ShowAllPacientes.propTypes = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

ShowAllPacientes.defaultProps = {
  json: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ShowAllPacientes;
