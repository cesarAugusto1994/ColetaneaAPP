'use strict'

import { getToken } from '../services/auth';

const axios = require('axios')

export const loginClient = axios.create({
    // baseURL: "http://192.168.15.29:1337",
    baseURL: "https://minhacoletanea.com.br",
    timeout: 30000
})

const apiClient = axios.create({
    // baseURL: "http://192.168.15.29:1337",
    baseURL: "https://minhacoletanea.com.br",
    timeout: 30000
})

apiClient.interceptors.request.use(
    async config => {
        const altConfig = config;
        altConfig.headers.Authorization = await getToken();
        return altConfig;
    },
    error => {
        Promise.reject(error);
    }
);


const errorHandler = (error, handleError) => {
    if (!handleError) {
        return Promise.reject(error);
    }

    if (error.response) {
        // Request was made but server responded with something
        // other than 2xx
        

        console.log('STATUS CODE:', error.response.status);
        console.log("Data:", error.response.data);
        console.log("Headers:", error.response.headers);
    } else {

    }

    return Promise.reject(error);
};

const client = (options, handleError = true) => {
    const onSuccess = response => {
        return response;
    };

    const onError = error => {
        return errorHandler(error, handleError);
    };

    return apiClient(options)
        .then(onSuccess)
        .catch(onError);
};

export default apiClient;

// const apiClient = axios.create({
//     baseURL: "http://192.168.0.134:3333/api/v1",
//     timeout: 30000
// })

// axios.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//       console.log({error})
//     // Do something with request error
//     return Promise.reject(error);
//   });

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     console.log({response})
//     return response;
//   }, function (error) {
//     console.log({error})
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   });

// export default apiClient