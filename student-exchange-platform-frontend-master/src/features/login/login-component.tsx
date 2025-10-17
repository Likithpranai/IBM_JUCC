import React, { useState } from 'react';
import {motion} from 'motion/react';
import '../../common/common.css';
import './login-component.css';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <motion.h2 initial={{scale: 0}} animate={{scale: 1}}>Login</motion.h2>
            <br></br>
            <motion.div initial={{scale: 0}} animate={{scale: 1}} className="card" id="login-container">
                <div className="input-container">
                    <p>Email:    </p>
                    <input type={"text"} ></input>
                </div>
                <div className="input-container">
                    <p>Password: </p>
                    <input type={"password"} ></input>
                </div>
                <motion.button initial={{scale: 0}} animate={{scale: 1}} id="login-button">Login</motion.button>
            </motion.div>
        </>
    );
}

export default LoginComponent;