import axios from "axios";


const login = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user/login`, body)
}

const getFileData = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/file-operation`)
}

const getRawData = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/file-operation/raw`)
}

const getStatusData = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/file-operation/status`)
}

const postData = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/file-operation/file-data`, body)
}

const postRawData = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/file-operation/raw-data`, body)
}

const refreshToken = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/user/refresh-token`)
}


const apiService = {
    login,
    getFileData,
    refreshToken,
    getRawData,
    getStatusData,
    postData,
    postRawData
}

export default apiService