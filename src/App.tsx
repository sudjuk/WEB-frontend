import { Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import ApiConfig from './components/ApiConfig';
import HomePage from './pages/HomePage';
import AstronomyListPage from './pages/AstronomyListPage';
import DayDetailPage from './pages/DayDetailPage';

function App() {
  return (
    <>
      <AppNavbar />
      <ApiConfig />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/astronomy" element={<AstronomyListPage />} />
        <Route path="/day_details/:id" element={<DayDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;


