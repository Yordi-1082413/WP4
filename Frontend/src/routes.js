// routes.js
import { lazy } from 'react';
import Layout from './layout';

const Landing = lazy(() => import('./pages/landing/landing'));
const LoginSignup = lazy(() => import('./pages/loginsignup/loginsignup'));
const ApiExample = lazy(() => import('./pages/apiexample/apiexample'));


export const routes = [
 { path: '/', element: <Landing /> },
 { path: '/loginsignup', element: <LoginSignup /> },
 { path: '/apiexample', element: <Layout><ApiExample /></Layout> },
];
