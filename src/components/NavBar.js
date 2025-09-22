import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => setActiveLink(value);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <button
            onClick={toggleMenu}
            className={`custom-toggle-btn d-md-none ${scrolled ? 'd-none' : ''}`}
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-md-block">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'}
                onClick={() => onUpdateActiveLink('home')}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className={activeLink === 'aboutus' ? 'active navbar-link' : 'navbar-link'}
                onClick={() => onUpdateActiveLink('aboutus')}
              >
                About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/loginform"
                className={activeLink === 'loginform' ? 'active navbar-link' : 'navbar-link'}
                onClick={() => onUpdateActiveLink('loginform')}
              >
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> 

      {/* Overlay */}
      <div
        className={`menu-overlay ${isMenuOpen ? 'menu-overlay-visible' : ''}`}
        onClick={closeMenu}
      />

      {/* Sliding Menu Panel */}
      <div className={`sliding-menu ${isMenuOpen ? 'sliding-menu-open' : ''}`}>
        <div className="menu-header">
          <h5 className="menu-title"> WaSup Hommie!!!</h5>
        </div>

        <nav className="menu-nav">
        <button
        onClick={() => {
          onUpdateActiveLink('home');
          closeMenu();
        }}
        className={`menu-item ${activeLink === 'home' ? 'menu-item-active' : ''}`}
        >
        <Link to="/" className="menu-item-text">Home</Link>
        </button>

        <button
        onClick={() => {
          onUpdateActiveLink('aboutus');
          closeMenu();
        }}
        className={`menu-item ${activeLink === 'aboutus' ? 'menu-item-active' : ''}`}
        >
        <Link to="/about" className="menu-item-text">About Us</Link>
        </button>

        {/* FIXED: Changed from /login to /loginform to match desktop */}
        <button
        onClick={() => {
          onUpdateActiveLink('loginform');
          closeMenu();
        }}
        className={`menu-item ${activeLink === 'loginform' ? 'menu-item-active' : ''}`}
        >
        <Link to="/loginform" className="menu-item-text">Login</Link>
        </button>
        </nav>
      </div>
    </>
  );
}