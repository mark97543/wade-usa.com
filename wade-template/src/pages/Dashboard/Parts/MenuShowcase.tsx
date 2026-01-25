import React from 'react'
import Menu from '../../../components/BaseComponents/Menu/Menu'

function MenuShowcase() {
    const MENU_ITEMS = [
        { id: 'menu1', label: 'Dashboard', path: '*', icon: "📊" },
        { id: 'menu2', label: 'Account Settings', path: '*', icon: "⚙️" },
        { id: 'menu3', label: 'Sign Out', path: '*', icon: "🚪" },
    ]

    const menuTitle = "Account Menu"

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: 'var(--gap-xl)', textAlign: 'left' }}>
            {/* --- HEADER --- */}
            <header style={{ borderBottom: '1px solid var(--color-neutral)', marginBottom: 'var(--gap-xl)' }}>
                <h1 style={{ color: 'var(--primary-color)' }}>Menu Dropdown</h1>
                <p style={{ fontSize: 'var(--font-md)', opacity: 0.8, marginBottom: 'var(--gap-md)' }}>
                    A floating navigation component used for grouped links and user actions.
                    Uses <strong>absolute positioning</strong> to prevent layout shifting.
                </p>
            </header>

            {/* --- LIVE PREVIEW --- */}
            <section style={{ 
                padding: 'var(--gap-xl)', 
                backgroundColor: 'var(--c-surface)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-neutral)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--gap-md)',
                marginBottom: 'var(--gap-xl)'
            }}>
                <span style={{ fontSize: 'var(--font-sm)', opacity: 0.5 }}>Live Preview</span>
                <Menu title={menuTitle} items={MENU_ITEMS} />
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--c-text)', marginTop: '20px' }}>
                    Hover over the button to test the dropdown.
                </p>
            </section>

            {/* --- PROPS DOCUMENTATION --- */}
            <section>
                <h3 style={{ borderBottom: '1px solid var(--color-neutral)', paddingBottom: 'var(--gap-xs)' }}>Props</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'var(--gap-md)', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ opacity: 0.6, fontSize: 'var(--font-sm)' }}>
                            <th style={{ padding: 'var(--gap-sm)' }}>Prop</th>
                            <th style={{ padding: 'var(--gap-sm)' }}>Type</th>
                            <th style={{ padding: 'var(--gap-sm)' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: 'var(--font-sm)' }}>
                        <tr style={{ borderBottom: '1px solid var(--color-neutral)' }}>
                            <td style={{ padding: 'var(--gap-sm)', fontFamily: 'monospace' }}>title</td>
                            <td style={{ padding: 'var(--gap-sm)' }}>string</td>
                            <td style={{ padding: 'var(--gap-sm)' }}>Text displayed on the toggle button.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--color-neutral)' }}>
                            <td style={{ padding: 'var(--gap-sm)', fontFamily: 'monospace' }}>items</td>
                            <td style={{ padding: 'var(--gap-sm)' }}>MenuItem[]</td>
                            <td style={{ padding: 'var(--gap-sm)' }}>Array of links with id, label, path, and icon.</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--gap-sm)', fontFamily: 'monospace' }}>style</td>
                            <td style={{ padding: 'var(--gap-sm)' }}>CSSProperties</td>
                            <td style={{ padding: 'var(--gap-sm)' }}>Optional inline styles for the wrapper.</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    )
}

export default MenuShowcase