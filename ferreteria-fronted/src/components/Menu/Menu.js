import React, { useState, useEffect } from "react";
import { FaHome, FaBox, FaPlus, FaShoppingCart, FaChartBar, FaUser, FaSignOutAlt } from "react-icons/fa";
import Productos from "../GestionProductos/GestionProductos";
import NuevosElementos from "../DistribuidoresMarcas/DistribuidoresMarcas";
import Venta from "../Ventas/Venta";

import TrabajadoresLogin from "../Trabajadores/TrabajadoresLogin";
import "./Menu.css";
import DashboardInicio from "../DashboardInicio/DashboardInicio";
import { jwtDecode } from "jwt-decode"
import logo from '../../assets/images/Logo.png';
import Login from "../Ingreso/Login";
import Swal from "sweetalert2";
const Menu = ({ onLogout }) => {
  /* This code snippet is setting up state variables `selectedOption` and `role` using the `useState`
  hook in React. */
  const [selectedOption, setSelectedOption] = useState("Inicio");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  /* The `menuOptions` constant is an array of objects, where each object represents a menu option in
  the application */
  const menuOptions = [
    { name: "Informes", icon: <FaChartBar /> },
    { name: "Gestion de Productos", icon: <FaBox /> },
    { name: "Gestionar Distribuidores y Marcas", icon: <FaPlus /> },
    { name: "Venta", icon: <FaShoppingCart /> },

    { name: "Trabajador", icon: <FaUser /> },
    { name: "Salir", icon: <FaSignOutAlt /> },
  ];

  /**
   * The function `handleMenuSelection` sets the selected option if the role is "admin" or the option
   * is "Venta" or "Inventario".
   * @param option - The `option` parameter in the `handleMenuSelection` function represents the menu
   * option selected by the user.
   */
  const handleMenuSelection = (option) => {
    if (role === "admin" || option === "Venta" || option === "Inventario") {
      setSelectedOption(option);
    }
  };
  /**
   * The `handleLogout` function displays a confirmation dialog using SweetAlert and logs the user out by
   * removing a token from localStorage and closing the current window if the user confirms.
   */

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres salir del programa?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar el token del localStorage para cerrar sesión
        localStorage.removeItem('token');
        // Cerrar la ventana actual
        window.close();  // Esto cierra la página
      }
    });
  };

  /**
   * The `renderContent` function returns different components based on the selected option, with a
   * default component for the dashboard homepage.
   * @returns The `renderContent` function returns different components based on the value of the
   * `selectedOption` variable. If `selectedOption` is "Inventario", it returns the `Productos`
   * component. If it is "Nuevos Elementos", it returns the `NuevosElementos` component. If it is
   * "Venta", it returns the `Venta` component. If it is "Tr
   */
  const renderContent = () => {
    switch (selectedOption) {
      case "Gestion de Productos":
        return <Productos />;
      case "Gestionar Distribuidores y Marcas":
        return <NuevosElementos />;
      case "Venta":
        return <Venta />;

      case "Trabajador":
        return <TrabajadoresLogin />;
      case "Salir":
        handleLogout();
        return null;
      default:
        return <DashboardInicio />;
    }
  };
  return (
    <div className="grid-container">
      <div className="menu menu1">
        <nav className="menu-bar">
          <div class="imagen">
            <img src={logo} width="200" height="200" />
          </div>

          {menuOptions.map(({ name, icon }) => (
            <button
              key={name}
              className={`menu-item ${selectedOption === name ? "active" : ""}`}
              onClick={() => handleMenuSelection(name)}
            >
              {icon} <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="menu menu2">{renderContent()}</div>
    </div>
  );
};

export default Menu;
