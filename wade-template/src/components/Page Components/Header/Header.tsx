// /root/projects/wade-template/src/components/Page Components/Header/Header.tsx

/**
 * This is the Header component. This should be imported on the top Page and Ingerited to following pages. 
 */

import style from './Header.module.css'
import { LAYOUT } from '../../../config/layout'
import Button from '../../BaseComponents/Button'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CONFIG } from '../../../config/layout'


function Header() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
     
        navigate(CONFIG.TOP_PAGE); 
      };

  return (
    <div className={style.HEADER_WRAPPER} style={{height:LAYOUT.HEADER_HEIGHT}}>
        <div className={style.LOGO_WRAPPER}>
            <h1 className={style.LOGO}>M&S</h1>
        </div>

        <div className={style.LINK_WRAPPER}>
            <p>Link 1</p>
            <p>Link 1</p>
            <p>Link 2</p>
        </div>

        <div className={style.RIGHT_WRAPPER}>
            {user?
                (
                    <Button type='danger' onClick={()=>handleLogout()} style={{width:'75px'}}>Logout</Button>
                ):(
                    <Button type='default' onClick={()=>navigate('/login')} style={{width:'75px'}}>Login</Button>
            )}

        </div>

    </div>
  )
}

export default Header