import React, { useEffect, useState } from 'react';
import {motion} from 'motion/react';
import '../../../common/common.css';
import '../login-component.css';
import './register-student-info.css'
import { PrevNextInterfaceProps } from '../../../common/prev-next-interface';

interface RegisterStudentNameProps extends PrevNextInterfaceProps<null> {
    setName: (firstName: string, lastName: string) => void;
}

function RegisterStudentName(props: RegisterStudentNameProps) {
    const [_names, _setNames] = useState({firstName: "", lastName: ""});

    return <>
        <motion.div initial={{scale: 0, x: -1000}} animate={{scale: 1, x: 0}} className="card register-container">
            <h3>First Name</h3>
            <input type="text" onChange={fName => _setNames({..._names, firstName: fName.target.value})} placeholder="e.g. Tai Man Tom"></input>
            
            <h3>Last Name</h3>
            <input type="text" onChange={lName => _setNames({..._names, lastName: lName.target.value})} placeholder="e.g. Chan"></input>

            {
                
            }
            
        </motion.div>
        <div>
            <button className='prev-next-btn' onClick={() => props.onPrev.forEach(f => f(null))}>Previous</button>
            {(_names.firstName.length > 0 && _names.lastName.length > 0) &&
                <button onClick={() => {
                    _setNames(_names);
                    props.onNext.forEach(f => f(null))
                }}></button>}
        </div>
    </>
}

export default RegisterStudentName;