import axios from 'axios'

export const REST = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})
