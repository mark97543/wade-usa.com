import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Hamburger } from '@/components/atoms/Hamburger/Hamburger';
import { Dropdown, DropdownItem } from '@/components/molecules/Dropdown/Dropdown';
import { Button } from '@/components/atoms/Button/Button';
import { ROLES } from '@/lib/directus'; 
import styles from './Header.module.css';

export const Header = () => {
  const { site_name, site_logo } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logoUrl = site_logo 
    ? `${import.meta.env.VITE_API_URL}/assets/${site_logo}` 
    : null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.role?.id === ROLES.ADMIN;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          
          {/* --- LEFT SECTION: Logo & Navigation Links --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            {/* 1. Brand / Logo */}
            <Link to="/" className={styles.brand} onClick={() => setIsMenuOpen(false)}>
              {logoUrl && <img src={logoUrl} alt={site_name} className={styles.logo} />}
              <span>{site_name}</span>
            </Link>

            {/* 2. Desktop Navigation (Hidden on Mobile) */}
            <nav className={styles.desktopNav}>
              <Link to="/design" className={styles.link}>Design System</Link>

              {/* Features Dropdown */}
              <Dropdown 
                trigger={
                  <span className={styles.link} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Features <small>▼</small>
                  </span>
                }
              >
                <DropdownItem onClick={() => navigate('/feature-a')}>Feature A</DropdownItem>
                <DropdownItem onClick={() => navigate('/feature-b')}>Feature B</DropdownItem>
                <DropdownItem onClick={() => navigate('/feature-c')}>Feature C</DropdownItem>
              </Dropdown>

              {/* Private Links */}
              {isAuthenticated && (
                <Link to="/dashboard" className={styles.link}>Dashboard</Link>
              )}

              {/* Admin Links */}
              {isAuthenticated && isAdmin && (
                 <a href="https://api.wade-usa.com/admin" target="_blank" rel="noreferrer" className={styles.link} style={{ color: 'var(--accent-color)' }}>
                   Admin
                 </a>
              )}
            </nav>
          </div>

          {/* --- RIGHT SECTION: Auth Actions & Mobile Toggle --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Desktop Auth (Hidden on Mobile) */}
            <div className={styles.desktopNav}>
              {isAuthenticated ? (
                <Dropdown 
                  trigger={
                    <span style={{ cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {user?.first_name || 'User'} <small>▼</small>
                    </span>
                  }
                >
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', opacity: 0.7 }}>
                    Signed in as <br/>
                    <strong>{user?.email}</strong>
                  </div>
                  <DropdownItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownItem>
                  <DropdownItem onClick={() => navigate('/profile')}>My Profile</DropdownItem>
                  <DropdownItem onClick={handleLogout} style={{ color: 'var(--danger-color)' }}>
                    Log Out
                  </DropdownItem>
                </Dropdown>
              ) : (
                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className={styles.mobileToggle}>
              <Hamburger 
                isOpen={isMenuOpen} 
                toggle={() => setIsMenuOpen(!isMenuOpen)} 
              />
            </div>
          </div>

        </div>
      </header>

      {/* 4. Mobile Menu Overlay */}
      <div 
        className={`${styles.backdrop} ${isMenuOpen ? styles.open : ''}`} 
        onClick={() => setIsMenuOpen(false)}
      />

      <nav className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <Link to="/design" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
          Design System
        </Link>
        
        {/* Mobile "Features" */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <div style={{ opacity: 0.5, marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Features</div>
          <Link to="/feature-a" className={styles.mobileLink} style={{ border: 'none', paddingLeft: '1rem', fontSize: '1rem' }} onClick={() => setIsMenuOpen(false)}>Feature A</Link>
          <Link to="/feature-b" className={styles.mobileLink} style={{ border: 'none', paddingLeft: '1rem', fontSize: '1rem' }} onClick={() => setIsMenuOpen(false)}>Feature B</Link>
        </div>

        {isAuthenticated && (
          <Link to="/dashboard" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
        )}

        {isAuthenticated ? (
          <button 
            className={styles.mobileLink} 
            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
            style={{ color: 'var(--danger-color)', textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
          >
            Log Out ({user?.first_name})
          </button>
        ) : (
          <Link to="/login" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        )}
      </nav>
    </>
  );
};