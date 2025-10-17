import React, { useState } from 'react';
import {motion} from 'motion/react';
import '../../common/common.css';
import './login-component.css';
import { RegisterProfileData, ProfileType, StudentData, StudentSpecificInfo, SchoolAdminData } from './register/register-type';
import RegisterChooseProfileType from './register/register-choose-profile-type';
import RegisterProfileInfo from './register/register-profile-university-info';
import RegisterStudentInfo from './register/register-student-info';

function RegisterComponent() {
    const [profileType, setProfileType] = useState<ProfileType | null>(null);
    const [idx, setIdx] = useState(0);
    const decrementIdx = () => idx > 0 ? setIdx(idx - 1) : null;
    const incrementIdx = () => setIdx(idx + 1);
    
    const [profileData, setProfileData] = useState<RegisterProfileData>();
    const [studentData, setStudentData] = useState<StudentData>();
    const [schoolAdminData, setSchoolAdminData] = useState<SchoolAdminData>();
    

    const setStudentSpecificInfo = (studentInfo: StudentSpecificInfo) => {
        setStudentData({
            ...studentData,
            major: studentInfo.major,
            studyLevel: studentInfo.studyLevel,
            gpa: studentInfo.gpa,
            courseInterests: studentInfo.courseInterests.split(",").map(s => s.trim()),
            schoolPreferences: studentInfo.schoolPreferences.split(",").map(s => s.trim()),
            targetCountries: studentInfo.targetCountries,
        } as StudentData);
    }

    const registerAuthScreen = (
        <motion.div initial={{scale: 0}} animate={{scale: 1}} className="card" id="login-container">
            <div className="input-container">
                <p>Email:    </p>
                <input type={"text"} ></input>
            </div>
            <div className="input-container">
                <p>Password: </p>
                <input type={"password"}></input>
            </div>
            <motion.button initial={{scale: 0}} animate={{scale: 1}} id="login-button">Continue</motion.button>
        </motion.div>
    )

    const studentFlow = [
        <RegisterProfileInfo onPrev={[() => setProfileType(null)]} onNext={[incrementIdx]}/>,
        <RegisterStudentInfo currentData={studentData ?? {} as StudentData} setStudentInfo={setStudentSpecificInfo} onPrev={[decrementIdx]} onNext={[incrementIdx]}/>,
        registerAuthScreen
    ]

    const schoolAdminFlow = [
        registerAuthScreen
    ]

    return <>
        <motion.h2 initial={{scale: 0}} animate={{scale: 1}}>Register</motion.h2>
        <br></br>
        {
            profileType === null ?
                <>
                    <RegisterChooseProfileType setProfileType={setProfileType} />
                </> : 
                <>
                    {(profileType === ProfileType.Student ? studentFlow[idx] : schoolAdminFlow[idx]) ?? <p>Something went wrong.</p>}
                </>
        }
        
    </>
}

export default RegisterComponent;