import React, { useState, useEffect } from 'react';
import styles from "./TrabajadoresLogin.css";
import Button from '../Button/Button';
import Input from '../Input/Input';
import Swal from 'sweetalert2';
import { FaPlusCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";

const TrabajadoresLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '', telefono: '' });
  const [workers, setWorkers] = useState([]);

  // Fetches and displays the list of workers from the server.
  // Requires a valid JWT token with an 'admin' role to authorize the request.

  const fetchWorkers = async () => {
    try {

      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Token no encontrado', 'Debes iniciar sesión primero.', 'error');
        return;
      }

      const decodedToken = jwtDecode(token);

      if (decodedToken.role !== 'admin') {
        Swal.fire('Acceso denegado', 'No tienes permisos para ver los trabajadores.', 'warning');
        return;
      }


      const response = await fetch('http://localhost:3000/api/user/getAllWorkers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📦 Datos recibidos de la API:", data);

      if (Array.isArray(data)) {
        setWorkers(data);
      } else if (Array.isArray(data.workers)) {
        setWorkers(data.workers);
      } else {
        Swal.fire('Error inesperado', 'La respuesta del servidor no tiene el formato esperado.', 'error');
      }

    } catch (err) {
      Swal.fire('Error al obtener trabajadores', err.message, 'error');
    }
  };
  // Checks if a worker with the provided username is already registered.
  // Returns true if the worker exists, false otherwise.
  const isWorkerRegistered = (username) => {
    return workers.some(worker => worker.username === username);
  };


  // Handles the registration of a new worker.
  // Validates if the username is already taken before sending the request to the backend.
  // If the registration is successful, clears the form and updates the worker list.

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el trabajador ya está registrado
    if (isWorkerRegistered(formData.username)) {
      Swal.fire('Error', 'El nombre de usuario ya está registrado.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: 'trabajador',
          telefono: formData.telefono,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar trabajador');
      }

      Swal.fire('¡Éxito!', 'Trabajador registrado exitosamente.', 'success');
      setFormData({ username: '', password: '', telefono: '' });
      fetchWorkers();
    } catch (err) {
      Swal.fire('Error al registrar trabajador', err.message, 'error');
    }
  };
  // Deletes a specific worker by their ID after confirming with the user.
  // Requires authentication via JWT token.
  // Displays a success or error message based on the outcome.
  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Token faltante', 'Debes iniciar sesión para realizar esta acción.', 'error');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/user/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      await response.json();
      fetchWorkers();

      Swal.fire('Eliminado', 'El trabajador ha sido eliminado.', 'success');
    } catch (err) {
      Swal.fire('Error', `No se pudo eliminar: ${err.message}`, 'error');
    }
  };

  // Hook that executes `fetchWorkers` when the component mounts.
  // Ensures that the worker list is available on the UI from the start.

  useEffect(() => {

    fetchWorkers();
  }, []);

  return (
    <div className="trabajadores-container">
      <h2>Registrar Trabajador</h2>
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <Input
            type="text"
            name="username"
            placeholder=" "
            className="inputBox"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            label="Nombre de Usuario"
          />
        </div>
        <div className="inputContainer">
          <Input
            type="password"
            name="password"
            placeholder=" "
            className="inputBox"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            label="Contraseña"
          />
        </div>
        <div className="inputContainer">
          <Input
            type="tel"
            name="telefono"
            placeholder=" "
            className="inputBox"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            required
            label="Número de Teléfono"
          />
        </div>

        <Button type="submit" className="loginBtn">Registrar</Button>
      </form>

      <h3>Lista de Trabajadores</h3>
      <div className="scroll-container">
        <ul>
          {workers.length > 0 ? (
            workers.map(worker => (
              <li key={worker.id_usuario} className="worker-item">
                {worker.nombre} - {worker.telefono}
                <button className="deleteBtn" onClick={() => handleDelete(worker.id_usuario, worker.nombre)}>
                  <AiFillDelete />
                </button>
              </li>
            ))
          ) : (
            <li>No hay trabajadores registrados.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TrabajadoresLogin;
