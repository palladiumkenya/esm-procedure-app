import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestComponent from "./test.component";

const Root: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + "home/procedure";

  return (
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/" element={<TestComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
