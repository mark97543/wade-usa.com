//client/src/widgets/curency_Converter/curency_converter.jsx

import React, { useState, useEffect, useCallback} from "react";
import './curency_converter.css'
// SimpleChartExample.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, // For the x-axis (labels)
  LinearScale,   // For the y-axis (values)
  PointElement,  // For the points on the line
  LineElement,   // For the line itself
  Title,         // For the chart title
  Tooltip,       // For tooltips on hover
  Legend,        // For the legend
} from 'chart.js';


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
    const [historical_30_raw, setHistorical_30_raw] = useState([]);
    const [historical_60_raw, setHistorical_60_raw] = useState([]);
    const [historical_90_raw, setHistorical_90_raw] = useState([]);
    // NEW: State for formatted chart data
    //const [chartData30, setChartData30] = useState(null);
    const [graphLoading, setGraphLoading] = useState(false);
    const [graphError, setGraphError] = useState(null);
    // NEW: State for selected period and formatted chart data for that period
    const [selectedPeriod, setSelectedPeriod] = useState(30); // Default to 30 days
    const [activeChartData, setActiveChartData] = useState(null); // Was chartData30
    
    // IMPORTANT: You MUST register the components you are going to use with Chart.js
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const switchCurrencies = () => { //Switch button function. 
        const temp = curency_1;
        // const temp2 = curency_amount_1;
        setCurency_1(curency_2);
        setCurency_2(temp);
        // setCurency_amount_1(curency_amount_2);
        // setCurency_amount_2(temp2);
    }

    // Renamed and using useCallback
    const fetchHistoricalRates = useCallback(async (from, to) => {
        if (!from || !to) return;
        setGraphLoading(true);
        setGraphError(null);

        const todayForEndDate = new Date(); 
        const endDateFormatted = todayForEndDate.toISOString().split('T')[0];

        const periodsToFetch = [30, 60, 90];
        const setters = {
            30: setHistorical_30_raw,
            60: setHistorical_60_raw,
            90: setHistorical_90_raw,
        };

        try {
            // Using Promise.all to fetch all periods concurrently
            await Promise.all(periodsToFetch.map(async (days) => {
                const dateRef = new Date();
                dateRef.setDate(dateRef.getDate() - days); 
                const startDateFormatted = dateRef.toISOString().split('T')[0];
                
                const response = await fetch( `https://api.frankfurter.app/${startDateFormatted}..${endDateFormatted}?from=${from}&to=${to}`);
                if (!response.ok) throw new Error(`HTTP error for ${days}-day data! status: ${response.status}`);
                const data = await response.json();
                if (data.rates) {
                    setters[days](data.rates);
                } else {
                    setters[days](null); // No rates found
                }
            }));
        } catch (error) {
            console.error('Error fetching historical data:', error);
            setGraphError(error.message);
            // Clear all raw data on error
            setHistorical_30_raw(null);
            setHistorical_60_raw(null);
            setHistorical_90_raw(null);
        } finally {
            setGraphLoading(false);
        }
    }, []);


    const fetchLatestRate = useCallback(async (from, to) => {
        if (!from || !to) return;
        try {
            const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
            if (!response.ok) throw new Error(`HTTP error for latest rate! status: ${response.status}`);
            const data = await response.json();
            
            if (data.rates && data.rates[to]) {
                const rate = data.rates[to];
                setCurency_rate(rate);
                // Ensure curency_amount_1 is a number before multiplication
                const amount1 = parseFloat(curency_amount_1);
                if (!isNaN(amount1)) {
                    setCurency_amount_2(parseFloat((amount1 * rate).toFixed(2)));
                } else {
                    setCurency_amount_2(0); // Or handle invalid amount1 input
                }
            } else {
                setCurency_amount_2(0); // Handle case where rate for 'to' currency is not found
            }
        } catch (error) {
            console.error('Error fetching latest rate:', error);
            setCurency_amount_2(0); // Reset or show error
        }
    }, [curency_amount_1]); // Depends on curency_amount_1 to recalculate amount_2

    // Effect for initial data load
    useEffect(() => {
        fetchLatestRate(curency_1, curency_2);
        fetchHistoricalRates(curency_1, curency_2);
    }, []); // Run once on mount with initial curency_1 and curency_2


    // Effect when selected currencies change
    useEffect(() => {
        // Update currency symbols
        const foundSymbol1 = curencySymbol.find(item => item.symbol === curency_1);
        if (foundSymbol1) setCurency_symbol_1(foundSymbol1.sign);
        const foundSymbol2 = curencySymbol.find(item => item.symbol === curency_2);
        if (foundSymbol2) setCurency_symbol_2(foundSymbol2.sign);

        // Fetch new data
        fetchLatestRate(curency_1, curency_2);
        fetchHistoricalRates(curency_1, curency_2);
    },[curency_1, curency_2, fetchLatestRate, fetchHistoricalRates, curencySymbol]); // React to currency changes

    // Effect to process raw historical data based on selectedPeriod
    useEffect(() => {
        let rawDataToProcess = null;
        if (selectedPeriod === 30) rawDataToProcess = historical_30_raw;
        else if (selectedPeriod === 60) rawDataToProcess = historical_60_raw;
        else if (selectedPeriod === 90) rawDataToProcess = historical_90_raw;

        if (rawDataToProcess && Object.keys(rawDataToProcess).length > 0 && curency_1 && curency_2) {
            const labels = Object.keys(rawDataToProcess).sort((a, b) => new Date(a) - new Date(b));
            
            const dataPoints = labels.map(date => 
                (rawDataToProcess[date] && rawDataToProcess[date][curency_2] !== undefined) ? rawDataToProcess[date][curency_2] : null
            ).filter(point => point !== null);

            const finalLabels = labels.filter(date => rawDataToProcess[date] && rawDataToProcess[date][curency_2] !== undefined);

            if (dataPoints.length > 0) {
                setActiveChartData({
                    labels: finalLabels,
                    datasets: [{
                        label: `Rate: ${curency_1} to ${curency_2}`, // Legend label (period info in title)
                        data: dataPoints,
                        borderColor: 'rgb(75, 192, 192)', borderWidth: 2.5,
                        backgroundColor: 'rgba(75, 192, 192, 0.35)',
                        pointBackgroundColor: 'rgb(75, 192, 192)', pointBorderColor: '#FFFFFF',
                        pointRadius: 0, pointHoverRadius: 0,
                        pointHoverBackgroundColor: '#FFFFFF', pointHoverBorderColor: 'rgb(75, 192, 192)',
                        tension: 0.1, fill: true,
                    }]
                });
            } else {
                setActiveChartData(null);
            }
        } else {
            setActiveChartData(null); 
        }
    }, [selectedPeriod, historical_30_raw, historical_60_raw, historical_90_raw, curency_1, curency_2]);



    // Chart.js options

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        // You can set a default font color for all text elements if your Chart.js version supports it well,
        // or set it individually as below.
        // color: '#EAEAEA', // Default color for all text, might need to be applied per element
    
        plugins: {
            legend: {
                display:false, // Hide legend if not needed
                position: 'top',
                labels: {
                    color: '#F0F0F0', // Very light gray, almost white
                    font: {
                        size: 13, // Ensure font size is not too small
                        weight: 'bold' // Make legend bold
                    },
                    padding: 20 // Add some padding to the legend items
                }
            },
            title: {
                display: false,
                text: 'Historical Exchange Rate (Last 30 Days)',
                color: '#FFFFFF',    // Pure White for the main title
                font: {
                    size: 18,         // Increase title font size
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20 // More space below the title
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)', // Darker tooltip background
                titleColor: '#FFFFFF',
                bodyColor: '#E0E0E0',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 10,
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1
            }
        },
        scales: {
            x: { // X-axis (Date)
                title: {
                    display: true,
                    text: 'Date',
                    color: '#E0E0E0', // Brighter for axis title
                    font: {
                        size: 15,
                        weight: 'bold'
                    },
                    padding: { top: 10 }
                },
                ticks: { // The date labels on the x-axis
                    color: '#D0D0D0', // Bright for the date labels
                    font: {
                        size: 11 // Ensure not too small
                    },
                    maxRotation: 45, // Rotate labels if they overlap
                    minRotation: 0,
                    maxTicksLimit: 3, // Limit number of ticks to avoid clutter
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.25)', // More visible grid lines
                    borderColor: 'rgba(255, 255, 255, 0.35)' // More visible axis line
                }
            },
            y: { // Y-axis (Exchange Rate)
                title: {
                    display: true,
                    text: 'Exchange Rate',
                    color: '#E0E0E0', // Brighter for axis title
                    font: {
                        size: 15,
                        weight: 'bold'
                    },
                    padding: { bottom: 10 }
                },
                ticks: { // The rate numbers on the y-axis
                    color: '#D0D0D0', // Bright for the rate labels
                    font: {
                        size: 11
                    },
                    padding: 5, // Add a little padding to the tick labels
                    // Example: Format to 4 decimal places for precision if needed
                    // callback: function(value) {
                    //     return value.toFixed(4);
                    // }
                    maxTicksLimit: 10, // Limit number of ticks to avoid clutter
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.25)', // More visible grid lines
                    borderColor: 'rgba(255, 255, 255, 0.35)' // More visible axis line
                },
                beginAtZero: false
            }
        }
    };

    // Handle amount input change to ensure it's a number for calculation
    const handleAmount1Change = (e) => {
        const value = e.target.value;
        // Allow empty string for user to clear input, otherwise parse as float
        setCurency_amount_1(value === "" ? "" : value); // Store as string for input, parse in fetchLatestRate
    };


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
                            <input type="number" className="form-control" aria-label="Amount" value={curency_amount_1} onChange={(e) => setCurency_amount_1(e.target.value)} />
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
                            <input type="number" className="form-control" aria-label="Amount" value={curency_amount_2} onChange={(e) => setCurency_amount_2(e.target.value)} />
                        </div>
                    </div>

                </div>
                <div className="currency-converter-graph">

                    <div className="currency-converter-graph" style={{ width: '400px', height: '350px',marginTop: '10px', padding: '10px', backgroundColor: '#2B2B2B', borderRadius: '8px' }}>
                        {graphLoading && <p style={{color: '#FFFFFF'}}>Loading graph data...</p>}
                        {graphError && <p style={{color: '#FF7F7F'}}>Error: {graphError}</p>}
                        {!graphLoading && !graphError && activeChartData && activeChartData.datasets && activeChartData.datasets[0].data.length > 0 ? (
                            <Line options={chartOptions} data={activeChartData} />
                        ) : (
                            !graphLoading && !graphError && <p style={{color: '#CCCCCC'}}>No historical data to display for selected period/currencies.</p>
                        )}
                    </div>
                    {/* UI for selecting graph period */}
                    <div className="currency-converter-period-selector" style={{ textAlign: 'center', margin: '20px 0' }}>
                        <button className={`btn ${selectedPeriod === 30 ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setSelectedPeriod(30)}>30 Days</button>
                        <button className={`btn ${selectedPeriod === 60 ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setSelectedPeriod(60)}>60 Days</button>
                        <button className={`btn ${selectedPeriod === 90 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedPeriod(90)}>90 Days</button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CurrencyConverter;