import React, { useState } from "react";
import axios from "axios";
import Input from "../Input/Input"; 
import styles from "./Login.module.css";

function Login({ onLogin }) {
  /* This block of code in the `Login` component is setting up multiple state variables using the
  `useState` hook in React. Here's what each state variable is used for: */
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleChange = (e) => {
    console.log("Campo cambiado:", e.target.name, "Valor:", e.target.value); 
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 /**
  * The `handleSubmit` function is an asynchronous function that handles form submission by sending a
  * POST request to a specified URL, logging relevant information, and updating messages based on the
  * response.
  */
  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    console.log("Formulario enviado con los siguientes datos:", formData);  

    try {
      const url = isSignUp
        ? "http://localhost:3000/api/user/register"
        : "http://localhost:3000/api/user/login";
        
      console.log("URL de solicitud:", url);  

      const response = await axios.post(url, formData);
      console.log("Respuesta del servidor:", response.data); 

      if (response.data.token) {
        console.log("Token recibido:", response.data.token); 
        localStorage.setItem('token', response.data.token);
      }

      if (isSignUp) {
        console.log("Usuario registrado exitosamente");
        setSuccessMessage("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        setIsSignUp(false);
      } else if (response.data.message === "Login exitoso") {
        console.log("Login exitoso"); 
        onLogin(response.data.role);  
      } else {
        console.log("Mensaje de error en login:", response.data.message);  
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);  
      setErrorMessage(error.response?.data?.message || "Error en la solicitud");
    }
  };

  return (
    <div className={styles.container}>
  
      <Input
        type="text"
        name="username"
        placeholder=""
        value={formData.username}
        onChange={handleChange}
        label="Nombre de Usuario"
      />
      <Input
        type="password"
        name="password"
        placeholder=""
        value={formData.password}
        onChange={handleChange}
        label="Contraseña"
      />

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

      <div className={styles.rememberMe}>
        <input type="checkbox" id="remember" />
        <label htmlFor="remember">Recordar</label>
      </div>

      <button
        className={styles.loginBtn}
        onClick={handleSubmit}
        style={{
          position: "relative",
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        {isSignUp ? "Registrarse" : "Ingresar"}
      </button>
    
    </div>
  );
}

export default Login;
