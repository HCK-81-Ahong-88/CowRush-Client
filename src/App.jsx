import { useEffect, useState } from "react";
import "./App.css";
import TypingTest from "./pages/TypingTest.page";
import LoginPage from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/typing-test" element={<TypingTest />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
