import React, {useEffect, useState} from 'react'
import {sendElectron, useSendElectron} from "../utilities/talkElectron";
import {Link, useHistory, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'bootstrap/dist/css/bootstrap.min.css';
import {
    faCalculator,
    faCartPlus,
    faChartLine, faCogs,
    faShoppingCart, faSignOutAlt, faSolarPanel,
    faUpload,
    faUser,
    faUserAstronaut
} from "@fortawesome/free-solid-svg-icons";
import './Main.css'
import {routePath } from "../utilities/routes";
import {faDashcube} from "@fortawesome/free-brands-svg-icons";


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
                <li> <Link to={routePath.home} className={location.pathname === routePath.home ? 'active' : ''}><FontAwesomeIcon icon={faSolarPanel} /> Escritorio</Link></li>
            </ul>
            <h2>
                Herramientas
            </h2>
            <ul>
                <li> <Link to={routePath.puntoDeVenta} className={location.pathname === routePath.puntoDeVenta ? 'active' : ''}><FontAwesomeIcon icon={faCalculator} /> Punto de Venta</Link> </li>
            </ul>
            <h2>
                Ventas
            </h2>
            <ul>
                <li> <Link to={routePath.cargaDeProductos} className={location.pathname === routePath.cargaDeProductos ? 'active' : ''}><FontAwesomeIcon icon={faUpload} /> Cargar Producto</Link> </li>
                <li> <Link to={routePath.editarVentas} className={location.pathname === routePath.editarVentas ? 'active' : ''}><FontAwesomeIcon icon={faShoppingCart} /> Editar Ventas</Link> </li>
                <li>  <Link to={routePath.reporteVentas} className={location.pathname === routePath.reporteVentas ? 'active' : ''}><FontAwesomeIcon icon={faChartLine} /> Reporte Ventas</Link> </li>
            </ul>

            <h2>
                Clientes
            </h2>
            <ul>
                <li> <Link to={routePath.clientes} className={location.pathname === routePath.clientes ? 'active' : ''}><FontAwesomeIcon icon={faUser} /> Clientes</Link> </li>
            </ul>

            <h2>
                Opciones
            </h2>
            <ul>
                <li> <Link to={routePath.usuarios} className={location.pathname === routePath.usuarios ? 'active' : ''}><FontAwesomeIcon icon={faUserAstronaut} /> Usuarios</Link> </li>
                <li> <a href="javascript:void(0)" onClick={ () => { sendElectron({chanel: 'new-window', args: {route: "settings"}}) }}> <FontAwesomeIcon icon={faCogs} /> Configuraciones</a> </li>
                <li> <a href="javascript:void(0)" onClick={ () => { logout() }}><FontAwesomeIcon icon={faSignOutAlt} />  Cerrar Sesión</a> </li>
            </ul>

        </nav>
    )
}
export default Main