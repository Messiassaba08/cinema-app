import React, { useState, useRef, useEffect } from "react";
import "./DropDownMenu.css";

type Props = {
  isLoggedIn: boolean;
};

const DropdownMenu: React.FC<Props> = ({ isLoggedIn }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <a href="/login" className="block px-4 py-2 hover:bg-gray-100">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="block px-4 py-2 hover:bg-gray-100">
                  Criar Conta
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Perfil
                </a>
              </li>
              <li>
                <a href="/logout" className="block px-4 py-2 hover:bg-gray-100">
                  Sair
                </a>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
