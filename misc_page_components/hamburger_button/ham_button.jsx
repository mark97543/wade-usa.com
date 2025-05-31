import React, {useState} from 'react'
import './ham_button.css'


function Ham_button({ onButtonClick, status }) {

    const [isToggled, setIsToggled] = useState(false);

    const toggle = ()=>{
        onButtonClick()
        setIsToggled(!isToggled)
    }


    return (
        <div className={`hb_container ${isToggled ? 'change':''}`} onClick={toggle}>
            <div className={`hb_bar1`}></div>
            <div className={`hb_bar2`}></div>
            <div className={`hb_bar3`}></div>
        </div>
    )
}



export default Ham_button
