import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renderiza título Filmes em Cartaz na rota raiz", () => {
  render(<App />);
  expect(screen.getByText(/Filmes em Cartaz/i)).toBeInTheDocument();
});
