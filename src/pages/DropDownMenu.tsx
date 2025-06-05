// DropdownMenu.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DropDownMenu.css";

type Props = {
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean; // CORRIGIDO: Adicionada a prop isAdminLoggedIn
  onLogout: () => void;
};

const DropdownMenu: React.FC<Props> = ({
  isLoggedIn,
  isAdminLoggedIn,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <div className="dropdown-container" ref={menuRef}>
      {isAdminLoggedIn && (
        <span
          style={{ color: "gold", fontWeight: "bold", marginRight: "10px" }}
        >
          ADMIN
        </span>
      )}
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
              {isAdminLoggedIn && (
                <li>
                  <Link
                    to="/admin/add-movie"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    Adicionar Filme
                  </Link>
                </li>
              )}
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
                <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogoutClick}
                  >
                    Sair
                  </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
