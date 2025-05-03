// /client/src/pages/home/home.jsx

import React, {Component} from "react";
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel'
import './home.css'


const HomePage = ()=>{


    return(
        <>  
            <div className="login-link">
                <h1 >Welcome</h1>
            </div>
            <div className="P404-video">
                    <video
                        width="100%" // Example: Make it responsive width
                        preload="metadata" // Helps load dimensions/duration quickly
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/Video_Ready_Cat_s_Vows.mp4' type="video/mp4" />
                        Your browser does not support the video tag. Please update your browser.
                    </video>
            </div>
            <div className="home-car-div">
                <Carousel showThumbs={false}>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/2.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/3.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/4.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/5.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/6.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/7.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/8.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/9.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/10.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/11.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/12.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/13.jpg'/>
                    </div>
                    <div>
                        <img src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/carousel_homepage/14.jpg'/>
                    </div>
                </Carousel>
            </div>
        </>
    )
}


export default HomePage;