import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import { Navbar, Footer, Home, Resources, Appointments, Community, Blog } from './index.js';
import Account from './routes/Account.jsx';

function App() {
  return (
     <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/community" element={<Community />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/account" element={<Account />} />
      </Routes>   
      <Footer />
    </div>
    
  );
}

export default App;