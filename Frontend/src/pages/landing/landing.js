// Landing.js
import React from 'react';
import { Link } from "react-router-dom";
import landingStyles from './landing.module.scss';
import landingpageimg from '../../img/logo.png'

function Landing() {
 return (
  <div className={landingStyles.container}>
    <div className={landingStyles.columnleft}>
    <img src={landingpageimg} alt="landingpageimg" />
    </div>
    <div className={landingStyles.columnright}>
      <div className={landingStyles.header}>Welkom bij <span>Glitch!</span></div>
      <div className={landingStyles.text}>Klik op de knop hierbeneden om in te loggen!</div>
      <Link to="/loginsignup" className={landingStyles.loginsignupbutton}>Inloggen</Link>
    </div>
  </div>
    
 );
}

export default Landing;
