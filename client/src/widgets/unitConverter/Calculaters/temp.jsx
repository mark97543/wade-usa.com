//client/src/widgets/unitConverter/Calculaters/temp.jsx

import React from "react";
import { useState, setState, useEffect } from "react";

const Temp_Calculater = ()=>{

    const [fromSelect, setFromSelect]= useState("select");
    const [toSelect, setToSelect]=useState('select')
    const [from, setFrom]=useState('')
    const [to, setTo]=useState('')
    

    const converter=()=>{
        if(fromSelect==="select"||from===""){
            setTo('')
            return
        }

        if(fromSelect==="f"){
            setToSelect("c")
            setTo(((from-32)*(5/9)).toFixed(2))

        }else if(fromSelect==="c"){
            setToSelect("f")
            setTo(((from*(9/5))+32).toFixed(2))
        }


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
                    <option value="f">Fahrenheit (°F)</option>
                    <option value='c'>Celsius(°C)</option>

                </select>
                <select className="form-select" id="to_select" value={toSelect} onChange={handleToSelectChange}>
                    <option value='select'>Select a Unit</option>
                    <option value="f">Fahrenheit (°F)</option>
                    <option value='c'>Celsius(°C)</option>
                </select>

            </div> 
       
        
        </>

    )
}

export default Temp_Calculater