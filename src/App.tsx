import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { Home } from './pages/home/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={`/${window.location.pathname}`} element={<Home />} />
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
