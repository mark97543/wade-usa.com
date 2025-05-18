// /client/src/pages/dashbaord/dash.jsx

import React from "react";
import './dash.css'
import Weather from "../../widgets/weather/weather";
import Analog_Clock from "../../widgets/analog_clock/clock";
import Countdown from "../../widgets/countdown/countdown";


//TODO: Add Countdown Widget
//TODO: Add To Do Widget

const Dashboard = () =>{

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    

    return(
        <div className="dash-box">
           
           <div className="dash-top-row">
                <Weather/>
                <Countdown/>
           </div>
            
            <div className="Clock_Cluster">
                <Analog_Clock location_Name="Local"/>
                <Analog_Clock timezone='America/Boise' location_Name="Ammon"/>
                <Analog_Clock timezone='Asia/Jakarta' location_Name="Bangkok"/>
            </div>
            

        </div>
    )


}

export default Dashboard;