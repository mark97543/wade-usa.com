//client/src/widgets/unitConverter/Calculaters/length.jsx

import React from "react";
import { useState, setState, useEffect } from "react";

const Length_Calculater = ()=>{

    const [fromSelect, setFromSelect]= useState("select");
    const [toSelect, setToSelect]=useState('select')
    const [from, setFrom]=useState('')
    const [to, setTo]=useState('')
    
    const Length_Conversion = {"in":1, "ft":1/12, "yd":1/ 36, "mi":1/63360, "mm":1/0.0393701, "cm":1/0.393701, "m":1/ 39.3701, "km":1/39370.1}

    const converter=()=>{
        if(fromSelect==="select"||toSelect==="select"||from===""){
            setTo('')
            return
        }

        const from_conv = Length_Conversion[fromSelect]
        const to_conv = Length_Conversion[toSelect]

        const converted = (from/from_conv)*to_conv

        setTo(converted.toFixed(3))


    }

    useEffect(() => {
        converter();
    }, [fromSelect, toSelect, from]); // Run converter whenever these states change

    const handleFromSelectChange=(e)=>{
        setFromSelect(e.target.value);
    }

    const handleToSelectChange=(e)=>{
        setToSelect(e.target.value)
    }

    const handleFromChange=(e)=>{
        setFrom(e.target.value)
    }

    return(
        <>
            <div className="Length_Box">
                <p className="Length_Top"><b>From:</b></p>
                <p className="Length_Top"><b>To:</b></p>
                
                <input type="number" className="form-control" placeholder="From Unit" id="From_input" value={from} onChange={handleFromChange}></input>
                <input type="number" className="form-control" placeholder="To Unit" id="to_input" value={to} readOnly></input>

                <select className="form-select" id="from_select" onChange={handleFromSelectChange}>
                    <option value='select'>Select a Unit</option>
                    <option value="in">Inches (in)</option>
                    <option value='ft'>Foot (ft.)</option>
                    <option value='yd'>Yard (yd.)</option>
                    <option value='mi'>Mile (m)</option>
                    <option value='mm'>Millimeter (mm)</option>
                    <option value='cm'>Centimeters (cm)</option>
                    <option value='m'>Meter (m)</option>
                    <option value='km'>Kilometer (km)</option>
                </select>
                <select className="form-select" id="to_select" onChange={handleToSelectChange}>
                    <option value='select'>Select a Unit</option>
                    <option value="in">Inches (in)</option>
                    <option value='ft'>Foot (ft.)</option>
                    <option value='yd'>Yard (yd.)</option>
                    <option value='mi'>Mile (m)</option>
                    <option value='mm'>Millimeter (mm)</option>
                    <option value='cm'>Centimeters (cm)</option>
                    <option value='m'>Meter (m)</option>
                    <option value='km'>Kilometer (km)</option>
                </select>

            </div> 
       
        
        </>

    )
}

export default Length_Calculater