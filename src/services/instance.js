import axios from 'axios'

var instance = axios.create({
  // baseURL: "http://111.230.149.150:9000",
  baseURL: "http://localhost:9000/apis",
  withCredentials: true
});

export default instance;
