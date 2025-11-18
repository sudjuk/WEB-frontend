import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isTauri } from '../config/tauriApiConfig';

function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleApiConfigClick = () => {
    window.dispatchEvent(new CustomEvent('openApiConfig'));
  };

  const isActive = (path: string) => {
    // Для HashRouter путь находится в location.hash
    const hashPath = location.hash.replace('#', '') || '/';
    return hashPath === path || location.pathname === path;
  };

  return (
    <BSNavbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <BSNavbar.Brand as={Link} to="/">AstroDist</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={isActive('/')}>
              Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/astronomy" active={isActive('/astronomy')}>
              Услуги
            </Nav.Link>
          </Nav>
          {isTauri && (
            <Nav>
              <Nav.Link onClick={handleApiConfigClick} style={{ cursor: 'pointer' }}>
                ⚙️ Настройки API
              </Nav.Link>
            </Nav>
          )}
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default AppNavbar;
