// Navbar.js
import React from 'react';
import styles from './navbar.module.scss';
import logominimal from './favicon.ico';

export default function Navbar(props) {
 return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <img src={logominimal} alt="Logo" />
      </div>
      <ul className={styles.navbarLinks}>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
 );
}
