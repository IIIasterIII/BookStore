const backend_url = "localhost:8001";
import axios from "axios";

const CACHE_TTL = 1000 * 60 * 5;
const cache: Record<string, { data: any; timestamp: number }> = {};

const fetchWithCache = async (key: string, url: string): Promise<any> => {
  const now = Date.now();

  if (cache[key] && now - cache[key].timestamp < CACHE_TTL) {
    console.log(`Serving from cache: ${key}`);
    return cache[key].data;
  }

  console.log('from server!')
  const res = await axios.get(url);
  const data = res.data.files;

  cache[key] = {
    data,
    timestamp: now,
  };

  return data;
};

export const getAvatars = async () => {
  return fetchWithCache("avatars", `http://${backend_url}/avatars`);
};

export const getBanners = async () => {
  return fetchWithCache("banners", `http://${backend_url}/banners`);
};

export const getBorders = async () => {
  return fetchWithCache("borders", `http://${backend_url}/borders`);
};
