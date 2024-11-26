// loginsignup.js
import React, { useState } from 'react';
import loginSignup from './loginsignup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';


function LoginSignup() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const handleSignup = async () => {
        try {
            const response = await fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error(`Signup failed: ${response.statusText}`);
            }

            navigate('/apiexample');
    
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.message); 
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            console.log(data);

            navigate('/apiexample');

        } catch (error) {
            console.error("Login error:", error);
        }
    };
    



    return (
        <div className={loginSignup.container}>
            <div className={loginSignup.header}>
                <div className={loginSignup.text}>{isSignUp ? "Sign Up" : "Login"}</div>
                <div className={loginSignup.underline}></div>
            </div>
            <div className={loginSignup.inputs}>
                {isSignUp && (
                    <div className={loginSignup.input}>
                        <FontAwesomeIcon className={loginSignup.icon} icon={faUser} />
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}
                <div className={loginSignup.input}>
                    <FontAwesomeIcon className={loginSignup.icon} icon={faEnvelope} />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={loginSignup.input}>
                    <FontAwesomeIcon className={loginSignup.icon} icon={faLock} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            {!isSignUp && (
                <div className={loginSignup.forgotpassword}>Lost Password? <span>Click Here!</span></div>
            )}
            <div className={loginSignup.submitcontainer}>
                {!isSignUp && (
                    <div className={loginSignup.gray} onClick={() => setIsSignUp(true)}>New here? Sign Up</div>
                )}
                {isSignUp && (
                    <div className={loginSignup.gray} onClick={() => setIsSignUp(false)}>Login instead</div>
                )}
                <div className={loginSignup.submit} onClick={isSignUp ? handleSignup : handleLogin}>Submit</div>
            </div>
        </div>
    );
}



export default LoginSignup;
