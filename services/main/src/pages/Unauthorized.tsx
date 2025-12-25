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
    borderRadius: '10px'
}


export default function Unauthorized(){


    return(
        <div>
            <h2 style={headingStyle}>You Do Not Have Permission To View This Page</h2>   
            <img style={imageStyle} src="Unauth.png" alt="Unautherized Image"></img>     
        </div>
    )
}