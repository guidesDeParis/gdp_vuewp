import axios from 'axios'

let path = 'http://' + window.location.hostname + ':8984'

export const REST = axios.create({
  baseURL: path + '/gdp',
  withCredentials: true,
  crossDomain: true,
  headers: {
    'Content-Type': 'application/json'
  }
})
