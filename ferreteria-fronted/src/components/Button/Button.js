/**
 * The Button component in JavaScript renders a button element with optional icon and text content.
 * @returns The `Button` component is being returned. It is a functional component that renders a
 * button element with optional icon and text content based on the props passed to it. The button's
 * type, onClick function, children (text content), icon (optional), onlyIcon flag, and className are
 * all configurable through props. The classNames are dynamically generated using the `clsx` library to
 * conditionally apply styles based
 */
// Button.jsx
import React from "react";
import styles from "./Button.module.css";
import clsx from "clsx"; 

function Button({ type = "button", onClick, children, icon: Icon, onlyIcon = false, className = "" }) {
  return (
    <button
      type={type}
      className={clsx(styles.button, onlyIcon && styles.onlyIcon, className)}
      onClick={onClick}
    >
      {Icon && <Icon className={styles.icon} />}
      {!onlyIcon && children}
    </button>
  );
}

export default Button;
