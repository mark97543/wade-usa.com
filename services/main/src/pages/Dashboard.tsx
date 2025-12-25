//Dashboard.tsx
import { Link } from "react-router-dom";

export default function Dashboard(){


    return(
        <div>
            Dashboard Page 


            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Public */}
                    <li><Link to="/">Home / Landing</Link></li>
                    
                    {/* System Pages */}
                    <li><Link to="/unauthorized">Unauthorized Error Page</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/showcase">Showcase</Link></li>
                    <li><Link to="/pending">Pending</Link></li>
                    <li><Link to="/404">404</Link></li>
            </ul>

        </div>
    )
}