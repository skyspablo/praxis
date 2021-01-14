import React, {useEffect, useState} from 'react'
import {sendElectron} from "../utilities/talkElectron";

const Settings = () => {

    const
        [dbHost, setDbHost] = useState(''),
        [dbName, setDbName] = useState(''),
        [dbUser, setDbUser] = useState(''),
        [dbPass, setDbPass] = useState('');

    useEffect( () => {
        const
            localDbUser = localStorage.getItem('dbUser'),
            localDbName = localStorage.getItem('dbName'),
            localDbPass = localStorage.getItem('dbPass'),
            localDbHost = localStorage.getItem('dbHost');

        if(localDbUser !== null) {
            setDbUser(localDbUser)
        }
        if(localDbPass !== null) {
            setDbPass(localDbPass)
        }
        if(localDbHost !== null) {
            setDbHost(localDbHost)
        }
        if(localDbName !== null) {
            setDbName(localDbName)
        }

    } ,[])

    const setItem = (localKey, value, setCallBack) => {
        localStorage.setItem(localKey,value);
        setCallBack(value)
        sendElectron( {args:{user:dbUser, host:dbHost, pass:dbPass, name:dbName}, chanel: 'update-database'} )
    }


    return <div className="container-fluid setting-container">
        <div className="row">
            <div className="col-12 mt-3">
                <h2>Configuraciones</h2>

                <div className="input-group my-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Host de base de datos</span>
                    </div>
                    <input type="text" className="form-control" value={dbHost} onChange={ (e) => { setItem('dbHost', e.target.value, setDbHost )}}  />
                </div>

                <div className="input-group my-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Usuario de base de datos</span>
                    </div>
                    <input type="text" className="form-control" value={dbUser} onChange={ (e) => { setItem('dbUser', e.target.value, setDbUser )}}  />
                </div>

                <div className="input-group my-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Clave de base de datos</span>
                    </div>
                    <input type="text" className="form-control" value={dbPass} onChange={ (e) => { setItem('dbPass', e.target.value, setDbPass )}}  />
                </div>

                <div className="input-group my-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Nombre de base de datos</span>
                    </div>
                    <input type="text" className="form-control" value={dbName} onChange={ (e) => { setItem('dbName', e.target.value, setDbName )}}  />
                </div>

            </div>
        </div>
    </div>
}

export default Settings