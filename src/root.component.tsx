import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Procedure from "./procedure.component";

const Root: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + "home/procedure";

  return (
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/" element={<Procedure />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
