// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Training from '../views/training/Training.jsx';
import Monitoring from '../views/monitoring/Monitoring.jsx';
import Inspection from '../views/inspection/Inspection.jsx';
import Profile from '../views/profile/Profile.jsx';
import Login from '../views/auth/Login.jsx';
import Register from '../views/auth/Register.jsx';
import BaseLayout from './BaseLayout.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Inspection />} />
          <Route path="train-data" element={<Training />} />
          <Route path="profile" element={<Profile />} />
          <Route path="monitoring" element={<Monitoring />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
