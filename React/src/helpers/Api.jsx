import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const ApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { API_BASE_URL };
export default ApiClient;
