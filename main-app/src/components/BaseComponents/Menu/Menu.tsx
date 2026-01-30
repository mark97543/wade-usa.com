import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.module.css';

interface MenuItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
}

interface MenuProps {
    style?: React.CSSProperties;
    title: string;
    items: MenuItem[];
}

function Menu({ style, title, items }: MenuProps) {
    // State to track if the menu is open
    const [isOpen, setIsOpen] = useState(false);

    // Logic Handlers
    const handleToggle = () => setIsOpen(!isOpen);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    return (
        <div 
            className={styles.MENU_WRAPPER} 
            style={style}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
        >
            <button 
                className={`${styles.MENU_BUTTON} ${isOpen ? styles.ACTIVE : ''}`}
                onClick={handleToggle}
                type="button"
            >
                {title}
                <span className={`${styles.CHEVRON} ${isOpen ? styles.CHEVRON_UP : ''}`}>
                    ▾
                </span>
            </button>

            <div className={`${styles.MENU_DROPDOWN} ${isOpen ? styles.SHOW : ''}`}>
                {items.map((item) => (
                    <Link 
                        key={item.id} 
                        to={item.path} 
                        className={styles.MENU_ITEM}
                        onClick={handleClose}
                    >
                        {item.icon && <span className={styles.ICON}>{item.icon}</span>}
                        <span className={styles.LABEL}>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Menu;