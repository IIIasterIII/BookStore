const backend_url = "localhost:5228"
import axios from "axios"

interface Transaction {
    sum: number
    euro: number
}

export const postRefill = async (user_id: number, tra: Transaction) => {
    console.log(user_id, tra)
    const res = await axios.post(`http://${backend_url}/refill/${user_id}`, tra)
    return res
}