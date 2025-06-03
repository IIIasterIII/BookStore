const backend = "localhost:8001"
import axios from "axios"

interface UserData {
    id_u: number
    item_type: string
    sum: number
    item_id: string 
    item_url: string 
}

export const postBuyItemDecoration = async (data: UserData) => {
    console.log(data)
    const res = await axios.post(`http://${backend}/item`, data)
    return res.data
}