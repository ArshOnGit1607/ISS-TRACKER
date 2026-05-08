import axios from 'axios';

const OPEN_NOTIFY_ISS = 'http://api.open-notify.org/iss-now.json';
const OPEN_NOTIFY_ASTROS = 'http://api.open-notify.org/astros.json';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

export const fetchISSLocation = async () => {
  const response = await axios.get(OPEN_NOTIFY_ISS);
  return response.data;
};

export const fetchAstronauts = async () => {
  const response = await axios.get(OPEN_NOTIFY_ASTROS);
  return response.data;
};

export const fetchNearestPlace = async (lat, lon) => {
  try {
    const response = await axios.get(NOMINATIM_API, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 10,
      },
      headers: {
        'User-Agent': 'React-Vite-ISS-Dashboard',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearest place:", error);
    return null;
  }
};
