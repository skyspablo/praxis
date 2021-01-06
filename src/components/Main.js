import React, {useEffect, useState} from 'react'
import {useSendElectron} from "../utilities/talkElectron";
import {Link, useHistory, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'bootstrap/dist/css/bootstrap.min.css';
import {faChartLine} from "@fortawesome/free-solid-svg-icons";
import './Main.css'
import {routePath } from "../utilities/routes";


const Main = (props) => {

    const [isLogged, setIsLogged] = useState(false);
    const history = useHistory()

    useEffect(() => {
        let loggedUser = localStorage.getItem('userId');
        setIsLogged(loggedUser !== null);

        if (loggedUser === null) {
            history.push(routePath.login);
        }
    },[history])

    useSendElectron({chanel: 'resize', args: {width: 1200, height: 750}});

    return <div className="app-container">
        { isLogged && <NavBar />}
        <div className="main-content">
            {props.children}
        </div>
    </div>
}


const NavBar = () => {
    const history = useHistory()
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem('userId')
        history.push(routePath.login);
    }
    return (
        <nav id="mainNav">
            <h2>Inicio</h2>
            <ul>
                <li> <Link to={routePath.home} className={location.pathname === routePath.home ? 'active' : ''}>Escritorio</Link></li>
            </ul>
            <h2>
                Herramientas
            </h2>
            <ul>
                <li> <Link to={routePath.puntoDeVenta} className={location.pathname === routePath.puntoDeVenta ? 'active' : ''}>Punto de Venta</Link> </li>
            </ul>
            <h2>
                <FontAwesomeIcon icon={faChartLine} /> Ventas
            </h2>
            <ul>
                <li> <Link to={routePath.cargaDeProductos} className={location.pathname === routePath.cargaDeProductos ? 'active' : ''}>Cargar Producto</Link> </li>
                <li> <Link to={routePath.editarVentas} className={location.pathname === routePath.editarVentas ? 'active' : ''}>Editar Ventas</Link> </li>
                <li> <Link to={routePath.reporteVentas} className={location.pathname === routePath.reporteVentas ? 'active' : ''}>Reporte Ventas</Link> </li>
            </ul>

            <h2>
                Clientes
            </h2>
            <ul>
                <li> <Link to={routePath.clientes} className={location.pathname === routePath.clientes ? 'active' : ''}>Clientes</Link> </li>
            </ul>

            <h2>
                Opciones
            </h2>
            <ul>
                <li> <Link to={routePath.usuarios} className={location.pathname === routePath.usuarios ? 'active' : ''}>Usuarios</Link> </li>
                <li> <a href="javascript:void(0)" onClick={ () => { logout() }}>Cerrar Sesión</a> </li>
            </ul>

        </nav>
    )
}
export default Main