import {useState, useEffect} from 'react'

const electron = window.require('electron')
const ipc = electron.ipcRenderer;

export const useInvokeElectron = async ({channel = "", args = []}) => {
    const
        [isLoading, setIsLoading] = useState(false),
        [data, setData] = useState(''),
        [isError, setIsError] = useState(false),
        [error, setError] = useState('');


    useEffect( () => {

        setIsLoading(true)
        setIsError(false)
        setError('')

        ipc.invoke(channel, args).then((result) => {
            setData(result)
        }).catch( err => {
            setError(err)
            setIsError(true)
        }).finally( () => {
            setIsLoading(false)
        })
    } , [channel,args])


    return {isLoading, data, isError, error}
}

export const invokeElectron = async ({channel = "", args = []}) => {
    console.log('invoking channel ' + channel)
    const response = {
        isLoading: false,
        data: '',
        isError: false,
        error: ''
    }

    response.isLoading = true;


    return new Promise(function(resolve, reject) {
        ipc.invoke(channel, args).then((result) => {
            response.isLoading = false;
            response.isError = false;
            response.error = '';
            response.data = result;

            resolve(response)
        }).catch( err => {
            response.isLoading = false;
            response.isError = true;
            response.error = '';
            response.data = '';
            reject(err)
        })

    })
}

export const useSendElectron = ({chanel = '', args = []}) => {
    return ipc.send(chanel, args)
}

export const sendElectron = ({chanel = '', args = []}) => {
    return ipc.send(chanel, args)
}