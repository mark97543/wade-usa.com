// /root/projects/wade-template/src/components/BaseComponents/Button.tsx

/**
 * This will showcase the Buttons
 */

import React from 'react'
import stlye from '../Dashboard.module.css'
import Button from '../../../components/BaseComponents/Button'

function ButtonShowcase() {
    const codeSnippet = `import Button from '../../../components/BaseComponents/Button'`

    const DefaultClick = () => {
        alert('Default Button Clicked')
    }

    const DangerClick = () => {
        alert('Danger Button Clicked')
    }

    const NeutralClicked = () =>{
        alert('Neutral Button Clicked')
    }

    

  return (
    <div className={stlye.BUTTONSHOWCASE_WRAPPER}>
        <h1>Buttons</h1>
        <p>The custom button component uses Directus theme variables for its primary color 
            and radius. It supports three distinct semantic types.</p>
        <div className={stlye.BUTTONSHOWCASE_WRAPPER_BUTTONS}>
            <Button type='default' onClick={DefaultClick}>Default</Button>
            <Button type='danger' onClick={DangerClick}>Danger</Button>
            <Button type='neutral' onClick={NeutralClicked}>Neutral</Button>
        </div>

        <hr style={{ margin: 'var(--gap-lg) 0', opacity: 0.2 }} />

        <p>Syntax</p>
        <p>Pass the <code>type</code> prop to define the button style.</p>
        <h3 style={{ marginTop: 'var(--gap-md)' }}>Props</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
            <li><code>children</code>: The text or icons inside the button.</li>
            <li><code>type</code>: 'default' | 'danger' | 'neutral'</li>
            <li><code>onClick</code>: Optional function for click events.</li>
            <li><code>style</code>:Optional In Line Styles</li>
        </ul>


    </div>
  )
}

export default ButtonShowcase