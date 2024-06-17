import axios from 'axios'
// const mainRoute = 'https://ruddy.rakhtshoo.com'
// const mainRoute = 'http://localhost:5000'
const mainRoute = 'https://webapi.ruddyapp.com'

async function makeRequest({ type, endpoint, data, params, token, formdata }) {
  return axios({
    url: mainRoute + endpoint,
    method: type,
    params: params || '',
    data: data || '',
    headers: token ? {
      Authorization: 'Bearer ' + token,
      'Content-Type': formdata ? 'multipart/form-data' : 'application/json'
    } : ''
  })
}
export default {
  GET: async (endpoint, token) => await makeRequest({ type: 'GET', endpoint, token }),
  POST: async (endpoint, data, token, formdata) => await makeRequest({ type: 'POST', endpoint, data, token, formdata }),
  PUT: async (endpoint, data, token, params) => await makeRequest({ type: 'PUT', endpoint, data, params, token }),
  DELETE: async (endpoint, token) => await makeRequest({ type: 'DELETE', endpoint, token }),
  PATCH: async (endpoint, data, token) => await makeRequest({ type: 'PATCH', endpoint, data, token })
}
