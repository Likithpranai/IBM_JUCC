import React, { useEffect, useState } from 'react';
import {motion} from 'motion/react';
import '../../../common/common.css';
import '../login-component.css';
import "./register-profile-university-info.css";
import { PrevNextInterfaceProps } from '../../../common/prev-next-interface';
import {
  CountrySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { Country } from 'react-country-state-city/dist/esm/types';
import Select from 'react-select';
import fetchUniversities from '../../../api/misc';

interface RegisterProfileUniversityInfoProps extends PrevNextInterfaceProps<null> {
}

function RegisterProfileInfo(props: RegisterProfileUniversityInfoProps) {
    const [onPrev, onNext] = [props.onPrev, props.onNext];
    const [country, setCountry] = useState<Country | null>(null);
    const [countryText, setCountryText] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [lastFetchedName, setLastFetchedName] = useState<string>("");
    const [university, setUniversity] = useState<string | null>(null);
    const [availableUniversities, setAvailableUniversities] = useState<string[]>([]);
    const [requireLoadUniversities, setRequireLoadUniversities] = useState<boolean>(false);

    useEffect(() => {
        if (!requireLoadUniversities) {
            return;
        }
        
        const fetchData = async () => { 
            setAvailableUniversities(await fetchUniversities(countryText, name));
            setLastFetchedName(name);
            setRequireLoadUniversities(false);
        };
        
        fetchData();
    }, [countryText, name, requireLoadUniversities]);

    return <>
        <motion.div initial={{scale: 0, x: -1000}} animate={{scale: 1, x: 0}} className="card" id="register-student-info-container">
        <motion.h3>Choose your country: </motion.h3>
        <CountrySelect onChange={newC => {
            const c : Country = newC as Country;
            if (c) {
                setCountry(c);
                setCountryText(c.name)
            }
        }}></CountrySelect>

        {country && <>
            <input type="text" onChange={(_text) => setName(_text.target.value)} placeholder='Enter your home institution (part of name is fine!): '></input>
        </>}
        {name.length > 0 && 
            <button onClick={() => {
                if (lastFetchedName === name) {
                    return;
                }
                setRequireLoadUniversities(true);
            }}>Search Universities</button>
        }
        {requireLoadUniversities &&
            <p>Searching universities...</p>
        }
        {availableUniversities.length > 0 && 
        <Select 
            id="university-dropdown" 
            options={availableUniversities.map(u => ({ value: u, label: u }))} 
            onChange={(val, action) => setUniversity(val?.value ?? "")} />
        }
        {availableUniversities.length === 0 && lastFetchedName !== "" &&
            <p className="error-text">Could not find university with this text in its name.</p>
        }
        <div>
            <button className='prev-next-btn' onClick={() => onPrev.forEach(prev => prev(null))}>Previous</button>
            {university && <button className='prev-next-btn' onClick={() => onNext.forEach(next => next(null))}>Next</button>}
        </div>
        </motion.div>
    </>
}

export default RegisterProfileInfo;