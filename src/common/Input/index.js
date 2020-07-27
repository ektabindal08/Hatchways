import React from "react";

function Input(props) {
  const {
    type = "text",
    name = "input-name",
    id = "input-001",
    onChange = () => {},
    className = "",
    value = "",
    placeholder = "",
    onKeyPress=()=>{}
  } = props;
  return (
    <input
      id={id}
      type={type}
      name={name}
      onChange={onChange}
      className={className}
      value={value}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
    />
  );
}
export default Input;
