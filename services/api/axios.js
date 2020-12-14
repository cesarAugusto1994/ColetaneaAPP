'use strict'

const axios = require('axios')

const apiClient = axios.create({
    baseURL: "http://192.168.15.16:3333/api/v1",
    timeout: 10000
})

export default apiClient