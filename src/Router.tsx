import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Module } from "./models";
import { Landing } from "./modules";

export const rootModule: Module[] = [
  {
    index: 0,
    label: "Landing",
    path: "/",
    page: <Landing />,
  },
];

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {rootModule.map((module: Module) => {
          return (
            <Route
              key={`${module.path}`}
              path={`${module.path}`}
              element={module.page}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
