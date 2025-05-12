//client/src/widgets/unitConverter/Calculaters/volume.jsx

import React from "react";
import { useState, setState, useEffect } from "react";

const Vol_Calculater = ()=>{

    const [fromSelect, setFromSelect]= useState("select");
    const [toSelect, setToSelect]=useState('select')
    const [from, setFrom]=useState('')
    const [to, setTo]=useState('')
    
    const Vol_Conversion = {"o":1, "c":1/8, 'p':1/16, 'q':1/32, 'g':1/128, 'm':1/0.033814, "l":1/33.81400000012258}

    const converter=()=>{
        if(fromSelect==="select"||toSelect==="select"||from===""){
            setTo('')
            return
        }

        const from_conv = Vol_Conversion[fromSelect]
        const to_conv = Vol_Conversion[toSelect]

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
                    <option value="o">Fluid Ounces (FlOz.)</option>
                    <option value='c'>Cup (cu)</option>
                    <option value='p'>Pint (p)</option>
                    <option value='q'>Quart (Q)</option>
                    <option value='g'>Gallon (g)</option>
                    <option value='m'>Milliliter (mL)</option>
                    <option value='l'>Litter (L)</option>
                </select>
                <select className="form-select" id="to_select" onChange={handleToSelectChange}>
                    <option value='select'>Select a Unit</option>
                    <option value="o">Fluid Ounces (FlOz.)</option>
                    <option value='c'>Cup (cu)</option>
                    <option value='p'>Pint (p)</option>
                    <option value='q'>Quart (Q)</option>
                    <option value='g'>Gallon (g)</option>
                    <option value='m'>Milliliter (mL)</option>
                    <option value='l'>Litter (L)</option>
                </select>

            </div> 
       
        
        </>

    )
}

export default Vol_Calculater