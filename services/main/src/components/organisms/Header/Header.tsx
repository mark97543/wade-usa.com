import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hamburger } from '@/components/atoms/Hamburger/Hamburger';
import { Dropdown, DropdownItem } from '@/components/molecules/Dropdown/Dropdown';
import { Button } from '@/components/atoms/Button/Button';
import styles from './Header.module.css';
import type { HeaderProps, NavItem } from './types'; 

export const Header = ({ 
  logoUrl, 
  siteName, 
  mainNav = [], 
  user, 
  onLogin, 
  onLogout 
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Helper: Renders a single nav item
  const renderNavItem = (item: NavItem, isMobile = false) => {
    // ---------------------------------------------------------
    // NOTE: Security checks are done in App.tsx. 
    // We assume everything passed to 'mainNav' is safe to render.
    // ---------------------------------------------------------

    // A. Dropdown Handling (Recursive)
    if (item.children && item.children.length > 0) {
      if (isMobile) {
        return (
          <div key={item.label} className={styles.mobileGroup}>
            <div className={styles.mobileGroupTitle}>{item.label}</div>
            {item.children.map(child => (
               <Link 
                 key={child.label} 
                 to={child.path || '#'} 
                 className={styles.mobileLink}
                 onClick={() => setIsMenuOpen(false)}
               >
                 {child.label}
               </Link>
            ))}
          </div>
        );
      }
      
      // Desktop Dropdown
      return (
        <Dropdown 
          key={item.label}
          trigger={
            <span className={styles.link} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {item.label} <small>▼</small>
            </span>
          }
        >
          {item.children.map((child) => (
            <DropdownItem key={child.label} onClick={() => child.path && navigate(child.path)}>
              {child.label}
            </DropdownItem>
          ))}
        </Dropdown>
      );
    }

    // B. Standard Link
    return (
      <Link 
        key={item.label} 
        to={item.path || '#'} 
        className={isMobile ? styles.mobileLink : styles.link}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          
          {/* --- LEFT: Brand & Main Nav --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link to="/" className={styles.brand} onClick={() => setIsMenuOpen(false)}>
              {logoUrl && <img src={logoUrl} alt={siteName} className={styles.logo} />}
              <span>{siteName}</span>
            </Link>

            {/* Desktop Nav Loop */}
            <nav className={styles.desktopNav}>
              {mainNav.map(item => renderNavItem(item, false))}
            </nav>
          </div>

          {/* --- RIGHT: User Actions --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Desktop Auth */}
            <div className={styles.desktopNav}>
              {user ? (
                <Dropdown 
                  trigger={
                    <span className="span_link" style={{ cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {user.name} <small>▼</small>
                    </span>
                  }
                >
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', opacity: 0.7 }}>
                    Signed in as <br/><strong>{user.email}</strong>
                    {/* Optional: Show Role Badge */}
                    <div style={{ marginTop: '0.25rem', fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>
                      {user.isAdmin ? 'Admin' : 'Member'}
                    </div>
                  </div>
                  {/* <DropdownItem onClick={() => navigate('/profile')}>My Profile</DropdownItem> */}
                  <DropdownItem onClick={onLogout} style={{ color: 'var(--danger-color)' }}>
                    Log Out
                  </DropdownItem>
                </Dropdown>
              ) : (
                <Button size="sm" onClick={onLogin}>Login</Button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className={styles.mobileToggle}>
              <Hamburger isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      <div className={`${styles.backdrop} ${isMenuOpen ? styles.open : ''}`} onClick={() => setIsMenuOpen(false)} />
      
      <nav className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        {mainNav.map(item => renderNavItem(item, true))}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
        {user ? (
          <>
            {/* <Link to="/profile" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>My Profile</Link> */}
            <button 
              className={styles.mobileLink} 
              onClick={() => { onLogout && onLogout(); setIsMenuOpen(false); }}
              style={{ color: 'var(--danger-color)', textAlign: 'left', width: '100%', background: 'transparent', border: 'none' }}
            >
              Log Out
            </button>
          </>
        ) : (
          <div style={{ padding: '0 1rem', marginTop: '0.5rem' }}>
             <Button size="sm" onClick={() => { onLogin && onLogin(); setIsMenuOpen(false); }} style={{ width: '100%' }}>Login</Button>
          </div>
        )}
      </nav>
    </>
  );
};