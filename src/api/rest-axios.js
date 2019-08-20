import axios from 'axios'

// let path = 'http://' + window.location.hostname + ':8984'
let path = 'http://dev.api.gdp.fr'

export const REST = axios.create({
  baseURL: path + '/gdp',
  // withCredentials: true,
  crossorigin: true,
  headers: {
    'Accept': 'application/json'
    // 'Access-Control-Allow-Credentials': true
  }
})
