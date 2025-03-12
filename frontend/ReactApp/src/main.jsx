import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import Navbar from './Navbar.jsx';
import StreetDetailPage from './StreetDetailPage.jsx';
import NotificationPage from './NotificationPage.jsx';
import PeakTime from './PeakTime.jsx';
import AccountPage from './AccountPage.jsx';
import AuthenticationPage from './AuthenticationPage.jsx'; // Import the AuthenticationPage component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/street/:streetId" element={<StreetDetailPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/peaktime" element={<PeakTime />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/auth" element={<AuthenticationPage />} /> {/* Route to AuthenticationPage */}
      </Routes>
    </Router>
  </StrictMode>
);
