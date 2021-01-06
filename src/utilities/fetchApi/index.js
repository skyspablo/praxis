import {useState, useEffect} from 'react'
import axios from 'axios'


export const useFetchApi = ({endpoint, method = 'get'}) => {
    const
        [isLoading, setIsLoading] = useState(false),
        [data, setData] = useState(''),
        [isError, setIsError] = useState(false),
        [error, setError] = useState('');


    useEffect(() => {

        setIsLoading(true)
        axios({
            method: method,
            url: endpoint,
            responseType: 'json'
        })
            .then(function(response){
                setData(response.data)
            })
            .catch(function (error) {
                setIsError(true)
                setError(error)
            })
            .then(function () {
                setIsLoading(false)
            });

    }, [endpoint, method])


    return {isLoading, data, isError, error}
}