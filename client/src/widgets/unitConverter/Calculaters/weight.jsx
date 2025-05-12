//client/src/widgets/unitConverter/Calculaters/weight.jsx

import React from "react";
import { useState, setState, useEffect } from "react";

const Weight_Calculater = ()=>{

    const [fromSelect, setFromSelect]= useState("select");
    const [toSelect, setToSelect]=useState('select')
    const [from, setFrom]=useState('')
    const [to, setTo]=useState('')
    
    const Weight_Conversion = {"oz":1, "p":1/16, "g":1/ 0.035274, "kg":1/35.274}

    const converter=()=>{
        if(fromSelect==="select"||toSelect==="select"||from===""){
            setTo('')
            return
        }

        const from_conv = Weight_Conversion[fromSelect]
        const to_conv = Weight_Conversion[toSelect]

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
                    <option value="oz">Ounces (Oz.)</option>
                    <option value='p'>Pound (lbs.)</option>
                    <option value='g'>Gram (g)</option>
                    <option value='kg'>Kilogram (kg)</option>

                </select>
                <select className="form-select" id="to_select" onChange={handleToSelectChange}>
                    <option value='select'>Select a Unit</option>
                    <option value="oz">Ounces (Oz.)</option>
                    <option value='p'>Pound (lbs.)</option>
                    <option value='g'>Gram (g)</option>
                    <option value='kg'>Kilogram (kg)</option>
                </select>

            </div> 
       
        
        </>

    )
}

export default Weight_Calculater