import React, { useState } from 'react';
import {motion} from 'motion/react';
import '../../../common/common.css';
import '../login-component.css';
import "./register-choose-profile-type.css";
import { ProfileType } from './register-type';

interface RegisterChooseProfileTypeProps {
    setProfileType : React.Dispatch<React.SetStateAction<ProfileType | null>>
}

function RegisterChooseProfileType(props: RegisterChooseProfileTypeProps) {
    const setProfileType = props.setProfileType;
    
    return <>
        <motion.div initial={{scale: 0}} animate={{scale: 1}} className="card">
        <motion.h1>Choose your profile type: </motion.h1>
        <br></br>
        <div id="choose-profile-container">
            <button onClick={() => setProfileType(ProfileType.Student)}>Student</button>
            <button onClick={() => setProfileType(ProfileType.SchoolAdmin)}>School Admin</button>
        </div>
            
        </motion.div>
    </>
}

export default RegisterChooseProfileType;