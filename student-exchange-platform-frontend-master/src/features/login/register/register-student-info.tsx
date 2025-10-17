import React, { useEffect, useState } from 'react';
import {motion} from 'motion/react';
import '../../../common/common.css';
import '../login-component.css';
import './register-student-info.css'
import { PrevNextInterfaceProps } from '../../../common/prev-next-interface';
import { Country } from 'react-country-state-city/dist/esm/types';
import { CountrySelect } from 'react-country-state-city';
import { StudentData, StudentSpecificInfo } from './register-type';
import { StudyLevelType } from '../../../api/api-types';
import Select from 'react-select';

interface RegisterStudentInfoProps extends PrevNextInterfaceProps<null> {
    setStudentInfo: (info: StudentSpecificInfo) => void;
    currentData: StudentData
}

function RegisterStudentInfo(props: RegisterStudentInfoProps) {
    const [info, setInfo] = useState({
        major: props?.currentData.major, 
        studyLevel: props?.currentData.studyLevel ?? null, 
        gpa: props.currentData?.gpa ?? null,
        courseInterests: props.currentData?.courseInterests ? props.currentData.courseInterests.join(",") : "",
        schoolPreferences: props.currentData?.schoolPreferences ? props.currentData.schoolPreferences.join(",") : "",
        targetCountries: props.currentData?.targetCountries ?? []
    } as StudentSpecificInfo);
    const setTargetCountry = (idx: number, c: Country | React.ChangeEvent<HTMLInputElement>) => {
        const country = c as Country;
        if (!country) return;
        const newCountries = info.targetCountries;
        if (newCountries )
        newCountries[idx] = country.name;
        setInfo({...info, targetCountries: newCountries});
    }
    const levelOfStudies = Object.keys(StudyLevelType) as Array<StudyLevelType>;

    return <>
        <motion.div initial={{scale: 0, x: -1000}} animate={{scale: 1, x: 0}} className="card register-container">
            <h3>What are you currently studying?</h3>
            <input type="text" onChange={m => setInfo({...info, major: m.target.value})} placeholder="e.g. Philosophy"></input>
            
            <h3>What level of study are you?</h3>
            <Select 
                placeholder=""
                options={levelOfStudies.map(l => ({label: l, value: l}))}
                onChange={(l, action) => setInfo({...info, studyLevel: StudyLevelType[l?.label as keyof typeof StudyLevelType]})}
            />

            <h3>What is your GPA {"(4 scale)"}?</h3>
            <input type="text" value={info.gpa !== null ? info.gpa.toString() : ""} onChange={g => {
                const num = Number(g.target.value);
                if (isNaN(num) || num < 0 || num > 4) {
                    setInfo({...info, gpa: null});
                    return;
                }
                setInfo({...info, gpa: num})
            }} placeholder="e.g. 3.5"></input>

            <h3>What are your course interests? {"(separated by commas)"}</h3>
            <input type="text" onChange={c => {
                setInfo({...info, courseInterests: c.target.value})
            }} placeholder="e.g. Machine Learning, Ethics, Anatomy etc."></input>

            <h3>What are your school preferences? {"(separated by commas)"}</h3>
            <input type="text" onChange={s => {
                setInfo({...info, schoolPreferences: s.target.value})
            }} placeholder="e.g. Near the sea, lively etc."></input>

            <h3>What are your preferred target countries?</h3>
            {[0, 1, 2].map(idx => (
                <CountrySelect 
                    key={idx} 
                    onTextChange={_ => {setTargetCountry(idx, _); }}
                    disabled={idx !== 0 && !info.targetCountries[idx - 1]} 
                    onChange={newC => setTargetCountry(idx, newC)} 
                    placeholder={`Target Country #${idx + 1}`}>
                </CountrySelect>
            ))}
        </motion.div>
        <div>
            <button className='prev-next-btn' onClick={() => props.onPrev.forEach(f => f(null))}>Previous</button>
            {(info.major && info.courseInterests && info.gpa && info.schoolPreferences && info.targetCountries.every(s => s)) &&
                <button onClick={() => {
                    props.setStudentInfo(info);
                    props.onNext.forEach(f => f(null))
                }}>Next</button>}
        </div>
    </>
}

export default RegisterStudentInfo;