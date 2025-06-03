const backend_url = "localhost:8000"
import axios from 'axios'
import Cookies from '../../node_modules/@types/js-cookie'

interface authData {
    username: string
    email: string
    password: string
    repeat_password: string
}

export const getRegister = async (data: authData) => {
    await axios.post(`http://${backend_url}/register`, data)
}

export const getLogin = async (data: authData) => {
    const res = await axios.post(`http://${backend_url}/token`, { loginData: data.username, password: data.password })
    console.log(res)
    Cookies.set('access_token', res.data.access_token)
}

export const getProtected = async (token: string) => {
    const res = await axios.get(`http://${backend_url}/protected`, { headers: { Authorization: `Bearer ${token}` }})
    return res.data
};

export const forgotPassword = async (email: string) => {
    const res = await axios.post(`http://localhost:8000/forgot-password`, {
        email: email
    })
    return res
}