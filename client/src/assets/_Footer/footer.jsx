import 'bootswatch/dist/lux/bootstrap.min.css'; //theme
import React, {useContext} from 'react'
import './footer.css'
import { MainContext } from '../../main.jsx'; // Import MainContext

const Footer = () => {
    const { footerVis } = useContext(MainContext); // Get footerVis from MainContext
    return footerVis ?(
        <div id='footerdiv'>
            <div id='footersheild'>
            <img src='../img/newlogo.jpeg' alt="our patch" id="footerImage"></img>
            </div>
        </div>
    ):null;
  }
  
  export default Footer; 