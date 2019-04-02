import { HTTP } from './http-axios'

export default {
  getPosts (cb) {
    HTTP.get('posts')
      .then(response => {
        console.log('response', response)
        cb(response.data)
      })
  },
  getPost (id, cb) {
    HTTP.get(`posts/` + id)
      .then(response => {
        console.log('response', response)
        cb(response.data)
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
