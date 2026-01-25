// /root/projects/wade-template/src/pages/Dashboard/Parts/Colors.tsx

/**
 * This will showcase the color for the light 
 * and dark themes 
 */

import React from 'react'
import style from '../Dashboard.module.css'
import { useTheme } from '../../../context/ThemeContext'

export default function Colors() {
    const {theme, toggleTheme} = useTheme(); //Theme is light or dark
  return (
    <div className={style.COLOR_SCHEME_WRAPPER}>
        <h1>Color Palet</h1>
        <p>There are two palets avaiable (Light and Dark) that could be edited in Directus</p>
        <div className={style.COLOR_DARK_THEME_DIV}>
            <button 
            onClick={toggleTheme}
                style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 'bold',
                    width: '100%',
                }}
                >
                {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
            </button>

            <div className={style.COLOR_PRIMARY_COLOR}>Primary Color: Button, Links, Highlights</div>
            <div className={style.COLOR_SECONDARY_COLOR}>Secondary Color: Accents, Success Messages</div>
            <div className={style.COLOR_BG_COLOR}>Background Color (Text Included)</div>
            <div className={style.COLOR_SURFACE_COLOR}>Surface Color: Cards, Sidebar, Headers</div>
        </div>


        
    </div>
  )
}

