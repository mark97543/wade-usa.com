// /root/projects/wade-template/src/components/Showcase/InputShowcase.tsx

import React, { useState } from 'react'
import style from '../Dashboard.module.css'
import Input from '../../../components/BaseComponents/Input/Input'

function InputShowcase() {
    const [textValue, setTextValue] = useState('')
    const [passValue, setPassValue] = useState('')
    const [emailValue, setEmailValue] = useState('')

    return (
        <div className={style.BUTTONSHOWCASE_WRAPPER}>
            <h1>Inputs</h1>
            <p>
                The custom Input component is built to maintain a consistent look across the app, 
                utilizing CSS variables for borders, padding, and focus states.
            </p>

            <div className={style.BUTTONSHOWCASE_WRAPPER_BUTTONS} style={{ flexDirection: 'column', gap: 'var(--gap-md)' }}>
                {/* Standard Text Input */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <p><small>Standard Text</small></p>
                    <Input 
                        placeholder="Type something..." 
                        value={textValue} 
                        onChange={(e) => setTextValue(e.target.value)} 
                    />
                </div>

                {/* Password Input */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <p><small>Password Type</small></p>
                    <Input 
                        type="password" 
                        placeholder="Enter password" 
                        value={passValue} 
                        onChange={(e) => setPassValue(e.target.value)} 
                    />
                </div>

                {/* Email Input */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <p><small>Email Type</small></p>
                    <Input 
                        type="email" 
                        placeholder="email@wade-usa.com" 
                        value={emailValue} 
                        onChange={(e) => setEmailValue(e.target.value)} 
                    />
                </div>

                {/* Disabled State */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <p><small>Disabled Input</small></p>
                    <Input 
                        placeholder="I am disabled" 
                        disabled={true} 
                        value="" 
                        onChange={() => {}} 
                    />
                </div>
            </div>

            <hr style={{ margin: 'var(--gap-lg) 0', opacity: 0.2 }} />

            <p>Syntax</p>
            <code>{`import Input from '../../components/BaseComponents/Input/Input'`}</code>
            
            <h3 style={{ marginTop: 'var(--gap-md)' }}>Props</h3>
            <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
                <li><code>placeholder</code>: The ghost text inside the field.</li>
                <li><code>type</code>: 'text' | 'password' | 'email' | 'number'</li>
                <li><code>value</code>: The state variable controlling the input.</li>
                <li><code>onChange</code>: Function to update the state on keystroke.</li>
                <li><code>disabled</code>: Optional boolean to lock the field.</li>
                <li><code>style</code>: Optional Inline Styles for the wrapper or input.</li>
            </ul>
        </div>
    )
}

export default InputShowcase