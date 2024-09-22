import React, { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "cancel" | "danger";
  text: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = "primary",
  className,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[color]} ${className || ""}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
