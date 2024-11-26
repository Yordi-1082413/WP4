// layout.js
import React from 'react';
import Navbar from './global/navbar/navbar';

const Layout = ({ children }) => (
 <>
    <Navbar />
    {children}
 </>
);

export default Layout;
