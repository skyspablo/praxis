import React, {useEffect, useState} from 'react'
import {invokeElectron, sendElectron, } from "../utilities/talkElectron";
import {faPen, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {routePath} from "../utilities/routes";
import Loader from "./Loader";


const electron = window.require('electron')
const ipc = electron.ipcRenderer;

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [paginas, setPaginas] = useState(0);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        ipcListener()
        ipc.on('new-product-created', ipcListener)
    }, [pagina])


    const openNewTab = (name) => {
        sendElectron({chanel: 'new-window', args: {route: name}})
    }

    const ipcListener = () => {
        setIsLoading(true)
        invokeElectron({channel: "get-productos", args: {page: pagina, search: search}})
            .then((response) => {
                if (response.isError === false) {
                    setPagina(response.data.data.current_page)
                    setPaginas(response.data.data.last_page);
                    setSearch(search);
                    setProductos(response.data.data.data ?? []);
                }
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false))

    }

    const pagination = [];
    const start_pagination = pagina - 5 > 0 ? pagina - 5 : 1;
    const last_pagination = start_pagination === 1 ? 10 : pagina + 5;

    if(start_pagination > 1){
        pagination.push( <button key={"pagination-previous"} className="btn btn-secondary mx-2" onClick={ () => setPagina(1)}>&lt;</button> )
    }

    for (let i = start_pagination; i < last_pagination && i <= paginas; i++){
        if(i === pagina){
            pagination.push( <button key={"pagination-"+i} className="btn btn-primary mx-2" onClick={ () => setPagina(i)}>{i}</button> )
        }else{
            pagination.push( <button key={"pagination-"+i} className="btn btn-secondary mx-2" onClick={ () => setPagina(i)}>{i}</button> )
        }
    }

    if(pagina < paginas){
        pagination.push( <button key={"pagination-next"} className="btn btn-secondary mx-2" onClick={ () => setPagina(paginas)}>&gt;</button> )
    }

    return (
        <>
            {isLoading && <Loader/>}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <span className="navbar-brand">Productos</span>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto"/>

                    <input className="form-control mr-sm-2" type="search" placeholder="Buscar" value={search} onChange={ (e) => { setSearch(e.target.value)}}/>
                    <button className="btn btn-secondary my-2 my-sm-0" onClick={ () => {
                        ipcListener();
                    }}>Buscar</button>

                </div>
                <button className="btn btn-success mx-2 " type="button" onClick={() => openNewTab('nuevo-producto')}>
                    <FontAwesomeIcon icon={faPlus}/> Agregar Producto
                </button>
            </nav>
            <div className="table-responsive mt-0">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>SKU</th>
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Precio</th>
                        <th>Existencia</th>
                        <th>Activo</th>
                        <th> </th>
                    </tr>
                    </thead>
                    <tbody>
                    {productos.map((producto) => {
                        return <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.sku}</td>
                            <td>{producto.name}</td>
                            <td>{producto.category_id}</td>
                            <td>{producto.price}</td>
                            <td>{producto.existence}</td>
                            <td>{producto.active}</td>
                            <td>
                                <button className="btn btn-sm mx-1 btn-primary"><FontAwesomeIcon icon={faPen} /></button>
                                <button className="btn btn-sm mx-1 btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>

                <div className="text-center mt-5">
                    {pagination}
                </div>
            </div>
        </>
    )
}

export default Products