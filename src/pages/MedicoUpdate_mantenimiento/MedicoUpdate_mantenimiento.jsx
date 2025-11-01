import React, { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";
import { ShowAll } from "@components";

import { styles } from "./MedicoUpdate_mantenimiento.module.css";
import {
  validateAndSanitize,
  isValidNumeroColegiado,
} from "../../utils/sanitizer";

const MedicoUpdate_mantenimiento = ({ lugarid }) => {
  const [responseData, setResponseData] = useState(null);
  const [num_colegiado, setNum_colegiado] = useState("");
  const [data, setData] = useState("");

  // Estados para errores de validación
  const [numColegiadoError, setNumColegiadoError] = useState("");
  const [dataError, setDataError] = useState("");

  const handleChangeNum = (valor) => {
    const { value } = valor.target;
    setNum_colegiado(value);

    // Validar número de colegiado en tiempo real
    if (value.trim() === "" || isValidNumeroColegiado(value)) {
      setNumColegiadoError("");
    } else {
      setNumColegiadoError("Número de colegiado inválido (1-15 dígitos)");
    }
  };

  const handleChangeData = (valor) => {
    const { value } = valor.target;
    setData(value);

    // Validar longitud en tiempo real (máximo 255 caracteres)
    if (value.length > 255) {
      setDataError("Máximo 255 caracteres");
    } else {
      setDataError("");
    }
  };

  const getMedicosBylugarid = async () => {
    try {
      const lugarIdValidation = validateAndSanitize(String(lugarid), {
        required: true,
        maxLength: 10,
      });

      if (!lugarIdValidation.isValid) {
        throw new Error(lugarIdValidation.error);
      }

      const response = await Axios.get(
        `http://localhost:3000/api/v1/medicos/lugar/${lugarIdValidation.sanitizedValue}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Hubo un error");
    }
  };

  const loadMedicos = async () => {
    setResponseData(await getMedicosBylugarid());
  };

  const updateName = async () => {
    try {
      // Validar número de colegiado
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: "numeroColegiado",
        maxLength: 8,
      });

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`);
      }

      // Validar nombre (requerido, máximo 100 caracteres, seguridad estricta)
      const nameValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      });

      if (!nameValidation.isValid) {
        throw new Error(`Nombre: ${nameValidation.error}`);
      }

      const response = await Axios.put(
        `http://localhost:3000/api/v1/medicos/nombre/${numColegiadoValidation.sanitizedValue}`,
        {
          nombre: nameValidation.sanitizedValue,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Hubo un error");
    }
  };

  const handleClickName = async () => {
    try {
      await updateName();
      await loadMedicos();
      alert("Nombre actualizado exitosamente");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const updateApellido = async () => {
    try {
      // Validar número de colegiado
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: "numeroColegiado",
        maxLength: 8,
      });

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`);
      }

      // Validar apellido (requerido, máximo 100 caracteres, seguridad estricta)
      const apellidoValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      });

      if (!apellidoValidation.isValid) {
        throw new Error(`Apellido: ${apellidoValidation.error}`);
      }

      const response = await Axios.put(
        `http://localhost:3000/api/v1/medicos/apellido/${numColegiadoValidation.sanitizedValue}`,
        {
          apellido: apellidoValidation.sanitizedValue,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Hubo un error");
    }
  };

  const handleClickApellido = async () => {
    try {
      await updateApellido();
      await loadMedicos();
      alert("Apellido actualizado exitosamente");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const updateDireccion = async () => {
    try {
      // Validar número de colegiado
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: "numeroColegiado",
        maxLength: 8,
      });

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`);
      }

      // Validar dirección (requerida, máximo 200 caracteres, seguridad estricta)
      const direccionValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 200,
        strictSecurity: true,
        allowSpecialChars: true,
      });

      if (!direccionValidation.isValid) {
        throw new Error(`Dirección: ${direccionValidation.error}`);
      }

      const response = await Axios.put(
        `http://localhost:3000/api/v1/medicos/direccion/${numColegiadoValidation.sanitizedValue}`,
        {
          direccion: direccionValidation.sanitizedValue,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Hubo un error");
    }
  };

  const handleClickDireccion = async () => {
    try {
      await updateDireccion();
      await loadMedicos();
      alert("Dirección actualizada exitosamente");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const updateTelefono = async () => {
    try {
      // Validar número de colegiado
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: "numeroColegiado",
        maxLength: 8,
      });

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`);
      }

      // Validar teléfono (requerido, formato de teléfono)
      const telefonoValidation = validateAndSanitize(data, {
        required: true,
        type: "phone",
        maxLength: 15,
      });

      if (!telefonoValidation.isValid) {
        throw new Error(`Teléfono: ${telefonoValidation.error}`);
      }

      const response = await Axios.put(
        `http://localhost:3000/api/v1/medicos/telefono/${numColegiadoValidation.sanitizedValue}`,
        {
          telefono: telefonoValidation.sanitizedValue,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Hubo un error");
    }
  };

  const handleClickTelefono = async () => {
    try {
      await updateTelefono();
      await loadMedicos();
      alert("Teléfono actualizado exitosamente");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const updateEspecialidad = async () => {
    try {
      // Validar número de colegiado
      const numColegiadoValidation = validateAndSanitize(num_colegiado, {
        required: true,
        type: "numeroColegiado",
        maxLength: 8,
      });

      if (!numColegiadoValidation.isValid) {
        throw new Error(`Número de colegiado: ${numColegiadoValidation.error}`);
      }

      // Validar especialidad (requerida, máximo 100 caracteres, seguridad estricta)
      const especialidadValidation = validateAndSanitize(data, {
        required: true,
        maxLength: 100,
        strictSecurity: true,
        allowSpecialChars: true,
      });

      if (!especialidadValidation.isValid) {
        throw new Error(`Especialidad: ${especialidadValidation.error}`);
      }

      const response = await Axios.put(
        `http://localhost:3000/api/v1/medicos/especialidad/${numColegiadoValidation.sanitizedValue}`,
        {
          especialidad: especialidadValidation.sanitizedValue,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Hubo un error");
    }
  };

  const handleClickEspecialidad = async () => {
    try {
      await updateEspecialidad();
      await loadMedicos();
      alert("Especialidad actualizada exitosamente");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    loadMedicos();
  }, []);

  if (!responseData) {
    return "Loading...";
  }

  return (
    <div className={styles}>
      <ShowAll json={responseData} />

      <br />
      <h2>Número de colegiado *</h2>
      <input
        type="text"
        placeholder="Número de colegiado (1-15 dígitos)"
        value={num_colegiado}
        onChange={handleChangeNum}
        maxLength="8"
        pattern="\d{1,15}"
        style={{ borderColor: numColegiadoError ? "red" : "inherit" }}
      />
      {numColegiadoError && (
        <span style={{ color: "red", fontSize: "12px" }}>
          {numColegiadoError}
        </span>
      )}

      <h2>Cambiar nombre *</h2>
      <br />
      <input
        type="text"
        placeholder="Escriba el nuevo nombre"
        value={data}
        onChange={handleChangeData}
        maxLength="100"
        style={{ borderColor: dataError ? "red" : "inherit" }}
      />
      {dataError && (
        <span style={{ color: "red", fontSize: "12px" }}>{dataError}</span>
      )}
      <br />
      <button type="submit" onClick={handleClickName}>
        Cambiar Nombre
      </button>

      <h2>Cambiar apellido *</h2>
      <br />
      <input
        type="text"
        placeholder="Escriba el nuevo apellido"
        value={data}
        onChange={handleChangeData}
        maxLength="100"
        style={{ borderColor: dataError ? "red" : "inherit" }}
      />
      {dataError && (
        <span style={{ color: "red", fontSize: "12px" }}>{dataError}</span>
      )}
      <br />
      <button type="submit" onClick={handleClickApellido}>
        Cambiar Apellido
      </button>

      <h2>Cambiar dirección *</h2>
      <br />
      <textarea
        placeholder="Escriba la nueva dirección"
        value={data}
        onChange={handleChangeData}
        maxLength="200"
        rows="3"
        style={{ borderColor: dataError ? "red" : "inherit" }}
      />
      {dataError && (
        <span style={{ color: "red", fontSize: "12px" }}>{dataError}</span>
      )}
      <br />
      <button type="submit" onClick={handleClickDireccion}>
        Cambiar Dirección
      </button>

      <h2>Cambiar teléfono *</h2>
      <br />
      <input
        type="tel"
        placeholder="Escriba el nuevo teléfono"
        value={data}
        onChange={handleChangeData}
        maxLength="15"
        pattern="[0-9+\-\s()]{10,15}"
        style={{ borderColor: dataError ? "red" : "inherit" }}
      />
      {dataError && (
        <span style={{ color: "red", fontSize: "12px" }}>{dataError}</span>
      )}
      <br />
      <button type="submit" onClick={handleClickTelefono}>
        Cambiar Teléfono
      </button>

      <h2>Cambiar especialidad *</h2>
      <br />
      <input
        type="text"
        placeholder="Escriba la nueva especialidad"
        value={data}
        onChange={handleChangeData}
        maxLength="100"
        style={{ borderColor: dataError ? "red" : "inherit" }}
      />
      {dataError && (
        <span style={{ color: "red", fontSize: "12px" }}>{dataError}</span>
      )}
      <br />
      <button type="submit" onClick={handleClickEspecialidad}>
        Cambiar Especialidad
      </button>

      {/* <h2>Cambiar lugar ID *</h2>
      <br />
      <input
        type="number"
        placeholder="Escriba el nuevo ID del lugar"
        value={data}
        onChange={handleChangeData}
        maxLength="10"
        min="1"
        style={{ borderColor: dataError ? 'red' : 'inherit' }}
      />
      {dataError && <span style={{ color: 'red', fontSize: '12px' }}>{dataError}</span>}
      <br />
      <button type="submit" onClick={handleClickLugarId}>Cambiar Lugar ID</button> */}

      <p style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
        * Campos requeridos
      </p>
    </div>
  );
};

MedicoUpdate_mantenimiento.propTypes = {
  lugarid: PropTypes.number,
};

MedicoUpdate_mantenimiento.defaultProps = {
  lugarid: PropTypes.number,
};

export default MedicoUpdate_mantenimiento;
