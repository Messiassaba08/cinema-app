import React from "react";

interface Props {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const DropdownMenu: React.FC<Props> = ({ isLoggedIn, onLogout }) => {
  return (
    <div className="dropdown-menu">
      {isLoggedIn ? (
        <button onClick={onLogout}>Sair</button>
      ) : (
        <span>Bem-vindo! Faça login</span>
      )}
    </div>
  );
};

export default DropdownMenu;
