import React, {useState} from 'react'
import Loader from "./Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faRecycle, faSyncAlt} from "@fortawesome/free-solid-svg-icons";



const Home = () => {

    const [isLoading, setIsLoading] = useState(false)

    const refresh = () => {
        setIsLoading(true)
        setTimeout( () => setIsLoading(false),200)
    }


    return (
        <>
            {isLoading && <Loader/>}
            <nav className="navbar navbar-expand-lg navbar-dark praxis-dark">
                <span className="navbar-brand">Escritorio</span>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto"/>
                </div>
                <button className="btn btn-outline-light mx-2 " type="button" onClick={() => refresh()}>
                    <FontAwesomeIcon icon={faSyncAlt}/> Actualizar datos
                </button>
            </nav>
        </>
    )
}

export default Home