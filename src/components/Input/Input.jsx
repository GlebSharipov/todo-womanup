import React from "react";

export const Input = ({ value, onChange, type, accept, ...props }) => {
  return (
    <input
      type={type}
      className="input"
      value={value}
      onChange={onChange}
      accept={accept}
      {...props}
    ></input>
  );
};
