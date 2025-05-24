import React from "react";
import styles from "./Input.module.css";
import clsx from "clsx"; // Ayuda a combinar clases de manera más limpia
/**
 * The function `Input` is a React component that renders an input field with customizable properties
 * like type, name, value, onChange, label, required, and className.
 * @returns The `Input` component is being returned. It renders an input element with specified props
 * such as type, name, value, onChange, label, required, and className. The input element is wrapped in
 * a div with specific styling classes.
 */

function Input({ type, name, value, onChange, label, required, className }) {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          type={type}
          name={name}
          placeholder=""
          className={clsx(styles.inputBox, className)} // Ahora permite agregar clases externas
          value={value}
          onChange={onChange}
          required={required}
        />
        <label className={value ? styles.filled : ""}>{label}</label>
      </div>
    </div>
  );
}

export default Input;
