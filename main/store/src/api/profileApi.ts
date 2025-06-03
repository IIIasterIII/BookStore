const backend_url = "localhost:5228"
import axios from 'axios'

interface personalDataInformation {
    username: string,
    gender: string,
    name: string | null,
    surname: string | null,
    description: string | null,
    birthday: string | null,
    country: string | null
}

export const getProfile = async (username: string) => {
    const res = await axios.get(`http://${backend_url}/profile/${username}`)
    return res.data
}

export const postProfilePersonalInformation = async (data: personalDataInformation, id: number) => {
    const res = await axios.post(`http://${backend_url}/profile/${id}`, data)
    return res.status
}

export const getBoughDecorations = async (user_id: number) => {
    const res = await axios.get(`http://${backend_url}/decoration/${user_id}`)
    return res
}

export const getBoughPurchase = async (user_id: number) => {
    const res = await axios.get(`http://${backend_url}/purchase/${user_id}`)
    return res
}

export const setBorder = async (user_id: number, border_url: string) => {
    const res = await axios.post(`http://${backend_url}/border/${user_id}`, border_url, {
        headers: { 'Content-Type': 'application/json' }
    })
    return res
}

export const setBanner = async (user_id: number, banner_url: string) => {
    const res = await axios.post(`http://${backend_url}/banner/${user_id}`, banner_url, {
        headers: { 'Content-Type': 'application/json' }
    })
    return res
}

export const getTopRichUsers = async () => {
    const res = await axios.get(`http://${backend_url}/profile/top-rich`)
    return res
}

export const setAvatar = async (user_id: number, avatar_url: string) => {
    console.log(user_id, avatar_url)
    const res = await axios.post(`http://${backend_url}/avatar/${user_id}`, avatar_url, {
        headers: { 'Content-Type': 'application/json' }
    })
    return res
}