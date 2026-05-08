import axios from 'axios';

const WHERETHEISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const OPEN_NOTIFY_ISS = 'http://api.open-notify.org/iss-now.json';
const OPEN_NOTIFY_ASTROS = 'http://api.open-notify.org/astros.json';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

export const fetchISSLocation = async () => {
  try {
    const response = await axios.get(WHERETHEISS_API);
    return {
      message: 'success',
      iss_position: {
        latitude: response.data.latitude,
        longitude: response.data.longitude
      },
      timestamp: response.data.timestamp
    };
  } catch (error) {
    console.warn("wheretheiss API failed, falling back to open-notify", error.message);
    const response = await axios.get(OPEN_NOTIFY_ISS);
    return response.data;
  }
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
