import React, {useEffect, useState} from 'react'
import {invokeElectron} from "../utilities/talkElectron";
import Loader from "./Loader";
import {useParams} from "react-router-dom";

const NewProduct = () => {
    const
        [isLoading, setIsLoading] = useState(false),
        [categories, setCategories] = useState([]),
        [name, setName] = useState(''),
        [sku, setSku] = useState(''),
        [price, setPrice] = useState(0),
        [existence, setExistence] = useState(1),
        [selectedCat, setSelectedCat] = useState('');

    const {id} = useParams();

    useEffect(() => {

            invokeElectron({channel: 'get-categorias'}).then((r) => {
                setCategories(r.data.data)
            })


            if(typeof id !== "undefined" && id !== undefined){
                invokeElectron({channel: 'get-producto', args:{id:id}}).then((r) => {
                   if(r.isError === false){
                       const productData = r.data.data[0];
                       setName(productData.name)
                       setSku(productData.sku)
                       setPrice(productData.price)
                       setExistence(productData.existence)
                       setSelectedCat(productData.category_id);
                   }
                })
            }

        }
        , [id])

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(id !== "undefined" && id !== undefined){
            invokeElectron({channel: 'update-producto', args: {id:id,sku:sku,price:price,name:name,category_id:selectedCat,existence:existence}}).then((r) => {
                // window.close();
            }).catch(err => console.error(err))
                .finally(() => setIsLoading(false))

        }else{

            invokeElectron({channel: 'crear-producto', args: {sku:sku,price:price,name:name,category_id:selectedCat,existence:existence}}).then((r) => {
                // window.close();
            }).catch(err => console.error(err))
                .finally(() => setIsLoading(false))
        }


    }



    return <>
        {isLoading && <Loader/>}
        <div className="container-fluid bg-white" style={{minHeight: "100vh"}}>
            <form onSubmit={(e) => {
                handleSubmit(e)
            }} className="pt-3">
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="product-name">Nombre de producto</label>
                        <input type="text" className="form-control" id="product-name" placeholder="" value={name}
                               onChange={(e) => {
                                   setName(e.target.value)
                               }}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="product-sku">SKU</label>
                        <input type="text" className="form-control" id="product-sku" placeholder=""
                               value={sku} onChange={(e) => {
                            setSku(e.target.value)
                        }}
                        />
                    </div>

                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="product-price">Precio</label>
                        <input type="number" className="form-control" id="product-price"
                        value={price}
                               onChange={ (e) => { setPrice(parseInt(e.target.value)) }}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="product-existence">Existencia</label>
                        <input type="number" className="form-control" id="product-existence"
                        value={existence}
                        onChange={ (e) => { setExistence(parseInt(e.target.value)) }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="product-category">Categoría</label>
                        <select id="product-category" className="form-control" value={selectedCat} onChange={(e) => {
                            setSelectedCat(e.target.value)
                        }}>
                            <option value=''>Seleccione una opcion...</option>
                            {categories.map((cat) => {
                                return <option key={cat.id} value={cat.id}>{cat.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="product-currency">Moneda</label>
                        <select id="product-currency" className="form-control">
                            <option>Guaraníes</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5 text-center">
                    <button type="submit" className="btn btn-primary">Cargar producto</button>
                    <button type="button" className="btn btn-danger mx-3" onClick={() => {
                        window.close();
                    }}>Cancelar
                    </button>
                </div>
            </form>
        </div>
    </>
}

export default NewProduct