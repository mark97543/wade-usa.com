//client/src/widgets/curency_Converter/curency_converter.jsx

import React, { useState, useEffect, use } from "react";
import './curency_converter.css'



const CurrencyConverter = () => {

    const [curencySymbol, setCurencySymbol] = useState([{
        'symbol': 'AUD',
        'name': 'Australian Dollar',
        'flag': '🇦🇺',
        'sign': 'A$'     
    },{
        'symbol': 'CAD',
        'name': 'Canadian Dollar',
        'flag': '🇨🇦',
        'sign': 'C$'
    },{
        'symbol': 'CNY',
        'name': 'Chinese Yuan',
        'flag': '🇨🇳',
        'sign': '¥'
    },{
        'symbol': 'EUR',
        'name': 'Euro',
        'flag': '🇪🇺',
        'sign': '€'
    },{
        'symbol': 'JPY',
        'name': 'Japanese Yen',
        'flag': '🇯🇵',
        'sign': '¥'
    },{
        'symbol': 'KHR',
        'name': 'Cambodian Riel',
        'flag': '🇰🇭',
        'sign': '៛'
    },{
        'symbol': 'MXN',
        'name': 'Mexican Peso',
        'flag': '🇲🇽',
        'sign': '$'
    },{
        'symbol': 'SGD',
        'name': 'Singapore Dollar',
        'flag': '🇸🇬',
        'sign': 'S$'
    },{
        'symbol': 'THB',
        'name': 'Thai Baht',
        'flag': '🇹🇭',
        'sign': '฿'
    },{
        'symbol': 'USD',
        'name': 'United States Dollar',
        'flag': '🇺🇸',
        'sign': '$'
    }]);
    
    const [curency_1, setCurency_1] = useState('USD');
    const [curency_2, setCurency_2] = useState('THB');
    const [curency_symbol_1, setCurency_symbol_1] = useState('$');
    const [curency_symbol_2, setCurency_symbol_2] = useState('฿');
    const [curency_rate, setCurency_rate] = useState(0);
    const [curency_amount_1, setCurency_amount_1] = useState(1);
    const [curency_amount_2, setCurency_amount_2] = useState(0);
    
    const switchCurrencies = () => { //Switch button function. 
        const temp = curency_1;
        const temp2 = curency_amount_1;
        setCurency_1(curency_2);
        setCurency_2(temp);
        setCurency_amount_1(curency_amount_2);
        setCurency_amount_2(temp2);
    }

    const fetchData = async (from, to) => {
        try {
            const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
            const data = await response.json();
            //console.log(data.rates);
            setCurency_rate(data.rates[to]);
            setCurency_amount_2((curency_amount_1 * data.rates[to]).toFixed(2));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => { //Pull Basic Data on Startup

        fetchData(curency_1, curency_2);


    }, []);


    useEffect(() => { //Pull Data on Curency Change
        setCurency_symbol_1(curencySymbol.find(item => item.symbol === curency_1).sign);
        setCurency_symbol_2(curencySymbol.find(item => item.symbol === curency_2).sign);
        fetchData(curency_1, curency_2);


    },[curency_1, curency_2, curency_amount_1, curency_amount_2]);

    //TODO: Need to make a graph
    //TODO: The to curenct is uneditable Need to make it editable

    return(
        <>
            <h1 className="currency-converter-title">Currency Converter</h1>
            <div className="currency-converter">
                <div className="currency-converter-calculator">

                    <div className="currency-converter-col_1">
                        <select className="form-select" id="curency_1" value={curency_1} onChange={(e) => setCurency_1(e.target.value)}>
                            {curencySymbol.map((item, index) => {
                                return (
                                    <option key={index} value={item.symbol}>
                                        {item.flag} {item.symbol} - {item.name}
                                    </option>
                                )
                            })}

                        </select>
                        <div className="input-group mb-3 CC">
                            <span className="input-group-text">{curency_symbol_1}</span>
                            <input type="text" className="form-control" aria-label="Amount" value={curency_amount_1} onChange={(e) => setCurency_amount_1(e.target.value)} />
                        </div>
                    </div>

                    <div className="currency-converter-col_2">
                        <button className="btn btn-primary CC_Reverse_Button" type="button" onClick={switchCurrencies}>
                            <span className="CC_Reverse">🔄</span>
                        </button>
                    </div>

                    <div className="currency-converter-col_3">
                        <select className="form-select" id="curency_2" value={curency_2} onChange={(e) => setCurency_2(e.target.value)}>
                            {curencySymbol.map((item, index) => {
                                return (
                                    <option key={index} value={item.symbol}>
                                        {item.flag} {item.symbol} - {item.name}
                                    </option>
                                )
                            })}
                        </select>
                        <div className="input-group mb-3 CC">
                            <span className="input-group-text">{curency_symbol_2}</span>
                            <input type="text" className="form-control" aria-label="Amount" value={curency_amount_2} onChange={(e) => setCurency_amount_2(e.target.value)} />
                        </div>
                    </div>

                </div>

            </div>
        </>

    )
}

export default CurrencyConverter;