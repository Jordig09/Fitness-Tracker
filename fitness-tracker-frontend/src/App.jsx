import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import WeightTraining from "./pages/WeightTraining";
import Basketball from "./pages/Basketball";
import Nutrition from "./pages/Nutrition";
import CalendarView from "./pages/CalendarView";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/weights" element={<WeightTraining />} />
          <Route path="/basketball" element={<Basketball />} />
          <Route path="/nutrition" element={<Nutrition />} />
        </Routes>
      </main>
      <NavBar /> {/* El NavBar debe ir al final */}
    </div>
  );
}

export default App;
