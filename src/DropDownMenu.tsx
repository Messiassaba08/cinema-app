import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DropDownMenu.css";

type Props = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

const DropdownMenu: React.FC<Props> = ({ isLoggedIn, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha o dropdown ao clicar em um item de link
  const handleLinkClick = () => {
    setOpen(false);
  };

  // Lida com o logout e fecha o dropdown
  const handleLogoutClick = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <div className="dropdown-container" ref={menuRef}>
      <img
        src="/login.png"
        alt="Menu"
        onClick={() => setOpen(!open)}
        className="login-icon"
        width={25}
      />

      {open && (
        <ul className="dropdown-menu">
          {!isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={handleLinkClick}
                >
                  Criar Conta
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={handleLinkClick}
                >
                  Perfil
                </Link>
              </li>
              <li>
                {/* Botão de Sair com as mesmas classes de estilo dos Links */}
                <button
                  onClick={handleLogoutClick}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  Sair
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
