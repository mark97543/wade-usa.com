// /client/src/pages/dashbaord/dash.jsx

import React from "react";
import './dash.css'
import Weather from "../../widgets/weather/weather";

const Dashboard = () =>{




    return(
        <div>
            <div className="dash-weather-widget">
                <Weather/>
            </div>
            



        
        </div>
    )


}

export default Dashboard;