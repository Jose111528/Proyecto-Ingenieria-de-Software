import React, { useState } from "react";
import Login from "./components/Ingreso/Login";
import Menu from "./components/Menu/Menu";
import "./App.css"; // Importamos los estilos

function App() {
  // State to track whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Añadimos estado para el rol del usuario

  // Handles successful login and sets authentication and user role
  const handleLogin = (role) => {
    console.log("Login exitoso", role); // Log cuando se realiza un login exitoso
    setIsAuthenticated(true);
    setUserRole(role); // Guardamos el rol del usuario
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <Menu role={userRole} />
      ) : (
        <div className="app-box">
          <h1 className="app-title">JOSCIAN</h1>
          <h3 className="second-title">INICIAR SESION</h3>
          <Login onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;
