// /client/src/pages/dashbaord/dash.jsx

import React from "react";
import './dash.css'
import Weather from "../../widgets/weather/weather";
import Analog_Clock from "../../widgets/analog_clock/clock";

//TODO: Add Clock Widget
//TODO: Add Countdown Widget
//TODO: Add To Do Widget

const Dashboard = () =>{

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(localTimeZone)
    

    return(
        <div className="dash-box">
           
            <Weather/>
            <div className="Clock_Cluster">
                <Analog_Clock location_Name="Local"/>
                <Analog_Clock timezone='America/Boise' location_Name="Ammon"/>
                <Analog_Clock timezone='Asia/Jakarta' location_Name="Bangkok"/>

            </div>
            

        </div>
    )


}

export default Dashboard;