import axios from "axios";

const api = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true,
	timeout: 60000,
})

export default api;