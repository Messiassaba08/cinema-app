import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DropDownMenu.css";

type Props = {
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
};

const DropdownMenu: React.FC<Props> = ({ isLoggedIn, isAdminLoggedIn, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref para o botão

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Verifica se o clique não foi no menu nem no botão que o abre
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="dropdown-container">
      {/* SUGESTÃO: Melhoria de acessibilidade */}
      <button
        onClick={toggleMenu}
        ref={buttonRef}
        className="dropdown-toggle-button"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <img
          src="/login.png"
          alt="Abrir menu do usuário"
          className="login-icon"
          width={25}
          data-testid="menu-icon"
        />
      </button>

      {open && (
        <ul className="dropdown-menu" role="menu" ref={menuRef}>
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>
                  Criar Conta
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* SUGESTÃO: Adicionado link condicional para admin */}
              {isAdminLoggedIn && (
                <li>
                  <Link to="/admin" onClick={closeMenu}>
                    Painel do Admin
                  </Link>
                </li>
              )}
              <li>
                <Link to="/profile" onClick={closeMenu}>
                  Perfil
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    onLogout();
                    closeMenu();
                  }}
                  className="logout-button"
                  data-testid="logout-button"
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