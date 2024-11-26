// index.js
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './global.scss';
import { routes } from './routes';
import LoadingSpinner from './global/loadingspinner/loadingspinner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </Router>
 </React.StrictMode>
);
