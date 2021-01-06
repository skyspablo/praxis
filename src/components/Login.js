import React, {useEffect, useState} from 'react'
import {invokeElectron, useSendElectron} from "../utilities/talkElectron";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import Loader from "./Loader";
import {routePath as path} from "../utilities/routes"
const Login = () => {
    console.log("estoy en login")
    const
        [userName, setUserName] = useState('test'),
        [userPass, setUserPass] = useState('admin'),
        [isLoading, setIsLoading] = useState(false);

    const history = useHistory()

    useSendElectron({chanel: 'resize', args: {width: 500, height: 360}});
    useEffect(() => {
        window.document.title = 'Praxis - Ingresar'

        let loggedUser = localStorage.getItem('userId');

        if(loggedUser !== null){
            history.push(path.home);
        }

    }, [isLoading,history])


    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        invokeElectron({channel: 'login-user', args: {username: userName, password: userPass}}).then((r) => {
            const {data,isError, error} = r;
            if(isError){
                return console.error(error);
            }
            if(data.status === "success"){
                localStorage.setItem('userId',data.user.id)
                history.push(path.home);
            }else{

            }
        }).catch(err => console.error(err))
            .finally( () => setIsLoading(false))
    }


    return <>
        {isLoading && <Loader />}
        <Container>
            <Row>
                <Col>
                    <Card className="mt-3 align-middle">
                        <Card.Body>
                            <Card.Title className={"text-center"}>
                                Iniciar Sesión
                            </Card.Title>

                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label>Usuario</label>
                                    <input type="text" className="form-control" value={userName}
                                           onChange={(e) => setUserName(e.target.value)}/>
                                </div>
                                <div className="form-group mt-2">
                                    <label>Contraseña</label>
                                    <input type="password" className="form-control" value={userPass}
                                           onChange={(e) => setUserPass(e.target.value)}/>
                                </div>

                                <div className="text-center">
                                    <Button variant="primary" type="submit">Ingresar</Button>
                                </div>
                            </form>


                        </Card.Body>

                    </Card>
                </Col>
            </Row>
        </Container>
    </>
}

export default Login