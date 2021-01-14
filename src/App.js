import './App.css';
import React from "react";
import {HashRouter  as Router, Link, Route, Switch} from "react-router-dom";
import Login from './components/Login'
import Main from "./components/Main";
import {routePath as path} from './utilities/routes'
import Products from "./components/Products";
import NewProduct from "./components/NewProduct";
import Settings from "./components/Settings";
import Home from "./components/Home";

function App (){

    const currentURL = window.location.href // returns the absolute URL of a page

    const pathname = window.location.pathname

    return (
        <Router>
            <Switch>

                <Route exact path={path.login}>
                    <Login />
                </Route>

                <Route exact path={path.usuarios}>
                    <Main>
                        <h2>{path.usuarios}</h2>
                    </Main>
                </Route>

                <Route exact path={path.clientes}>
                    <Main>
                        <h2>{path.clientes}</h2>
                    </Main>
                </Route>

                <Route exact path={path.cargaDeProductos}>
                    <Main>
                        <Products />
                    </Main>
                </Route>

                <Route exact path={path.editarVentas}>
                    <Main>
                        <h2>{path.editarVentas}</h2>
                    </Main>
                </Route>

                <Route exact path={path.reporteVentas}>
                    <Main>
                        <h2>{path.reporteVentas}</h2>
                    </Main>
                </Route>

                <Route exact path={path.puntoDeVenta}>
                    <Main>
                        <p>{currentURL}</p>
                        <p>{pathname}</p>
                        <h2>{path.puntoDeVenta}</h2>
                    </Main>
                </Route>

                <Route exact path="/nuevo-producto">
                    <NewProduct />
                </Route>

                <Route exact path="/actualizar-producto/:id">
                    <NewProduct />
                </Route>

                <Route exact path="/settings">
                    <Settings />
                </Route>

                <Route exact path={path.home}>
                    <Main>
                        <Home />
                    </Main>
                </Route>

                <Route exact path="*">
                    <h2>Error </h2>
                    <p>{currentURL}</p>
                    <p>{pathname}</p>
                    <Link to={path.home}>Home</Link>
                </Route>

            </Switch>
        </Router>
    );


}

export default App;
