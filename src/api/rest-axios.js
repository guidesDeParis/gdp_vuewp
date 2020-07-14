import axios from 'axios'

// TODO: make this one as settings (or find an other solution)
// https://dev.to/sanfra1407/how-to-use-env-file-in-javascript-applications-with-webpack-18df
// switch (app_env) {
//   case 'dev':
//     let path = `http://${window.location.hostname}:8984`
//     break;
//   case 'prod':
//     let path = `http://${window.location.hostname}/api`
//     break;
// }
// let path = 'http://dev.api.gdp.fr'
// let path = 'http://localhost:8984'
// const
// let path = 'http://' + window.location.hostname + (window.env === 'prod' ? '/api' : ':8984')

export const REST = axios.create({
  // baseURL: 'http://',
  // withCredentials: true,
  crossorigin: true,
  headers: {
    'Accept': 'application/json'
    // 'Access-Control-Allow-Credentials': true
  }
})
