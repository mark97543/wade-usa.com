//Pending.tsx
import type { CSSProperties } from "react"

const headingStyle: CSSProperties = {
    textAlign: 'center',
    marginTop: '2rem',
    marginBottom: '2rem'
}

const imageStyle: CSSProperties = {
    display: 'block',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '10px',
    width: '100%'
}

export default function Pending(){


    return(
        <div>
            <h2 style={headingStyle}>Your Request Is Pending</h2> 
            <img style={imageStyle} src="pending.png" alt="Pending Image"></img>

            <p style={headingStyle}>Please contact the Awsomness Mr. Wadus if you need help</p>
        </div>
    )
}