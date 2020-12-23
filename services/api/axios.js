'use strict'

const axios = require('axios')

const apiClient = axios.create({
    baseURL: "http://192.168.15.16:1337",
    // baseURL: "https://minhacoletanea.com",
    timeout: 30000
})
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

export default apiClient