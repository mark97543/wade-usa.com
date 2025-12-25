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



export default function Page404(){
    return(
        <div>
            <h2 style={headingStyle}>404 Page Not Found</h2>
            <img style={imageStyle} src="404.png" alt="404 Image"></img>
        </div>
    )
}