import axios from 'axios'

// TODO: make this one as settings (or find an other solution)
let path = 'http://' + window.location.hostname + ':8984'
// let path = 'http://dev.api.gdp.fr'
// let path = 'http://localhost:8984'

export const REST = axios.create({
  baseURL: path,
  // withCredentials: true,
  crossorigin: true,
  headers: {
    'Accept': 'application/json'
    // 'Access-Control-Allow-Credentials': true
  }
})
