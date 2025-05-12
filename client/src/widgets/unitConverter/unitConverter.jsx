// /client/src/widgets/unitConverter/unitConverter.jsx

import React from "react";
import './unitConverter.css'
import Length_Calculator from './Calculaters/length.jsx';
import Weight_Calculator from "./Calculaters/weight.jsx";
import Temperature_Calculator from "./Calculaters/temp.jsx";
import Vol_Calculator from "./Calculaters/volume.jsx";


const UnitConverter = () => {

    return (
        <div className="Unit_Converter">
             <div className='Unit_Converter_Box'>
                <h3 className='Unit_Converter_Title'>UNIT CONVERTER</h3>

                <ul className='nav nav-tabs unit_con_tabs' role='tablist'>
                    <li className='nav-item' role='presentation'>
                        <a className='nav-link active' data-bs-toggle="tab" href='#length' aria-selected="true" role='tab'>Length</a>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <a className='nav-link' data-bs-toggle="tab" href='#temp' aria-selected="false" role='tab'>Temp</a>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <a className='nav-link' data-bs-toggle="tab" href='#weight' aria-selected="false" role='tab'>Weight</a>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <a className='nav-link' data-bs-toggle="tab" href='#vol' aria-selected="false" role='tab'>Volume</a>
                    </li>
                </ul>
                <div id='myTabContent' className='tab-content'>
                    <div className="tab-pane fade show active" id="length" role="tabpanel">
                        <Length_Calculator></Length_Calculator>
                    </div>
                    <div className="tab-pane fade" id="temp" role="tabpanel">
                        <Temperature_Calculator></Temperature_Calculator>
                    </div>
                    <div className="tab-pane fade" id="weight" role="tabpanel">
                        <Weight_Calculator></Weight_Calculator>
                    </div>
                    <div className="tab-pane fade" id="vol" role="tabpanel">
                        <Vol_Calculator></Vol_Calculator>
                    </div>
                 </div>
            </div>
            <div className="Unit_Converter_Img">
                <video
                    width="100%" // Example: Make it responsive width
                    preload="metadata" // Helps load dimensions/duration quickly
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/unit_Converter/unitconverter.mp4' type="video/mp4" />
                    Your browser does not support the video tag. Please update your browser.
                </video>
            </div>
        </div>
    )
}

export default UnitConverter;