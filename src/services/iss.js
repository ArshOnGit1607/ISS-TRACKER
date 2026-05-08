import axios from 'axios';
import * as satellite from 'satellite.js';

// --- HTTPS APIs ---
const TLE_API = 'https://tle.ivanstanojevic.me/api/tle/25544';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

// --- TLE Cache (refresh every 2 hours) ---
let cachedTLE = null;
let tleFetchedAt = 0;
const TLE_CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Fetch the latest TLE (Two-Line Element) data for the ISS.
 * TLE data changes slowly (updated a few times per day), so we cache it.
 */
async function getTLE() {
  const now = Date.now();
  if (cachedTLE && (now - tleFetchedAt) < TLE_CACHE_DURATION) {
    return cachedTLE;
  }
  
  try {
    const response = await axios.get(TLE_API, { timeout: 8000 });
    cachedTLE = {
      line1: response.data.line1,
      line2: response.data.line2,
      name: response.data.name,
    };
    tleFetchedAt = now;
    return cachedTLE;
  } catch (error) {
    // If we have a previous cache, use it even if stale (TLE is valid for days)
    if (cachedTLE) return cachedTLE;
    throw new Error('Unable to fetch ISS orbital data');
  }
}

/**
 * Compute the ISS position using SGP4 propagation from TLE data.
 * This runs entirely client-side — no external API call needed per tick.
 */
function propagateISS(tle, date = new Date()) {
  const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
  const positionAndVelocity = satellite.propagate(satrec, date);
  
  if (!positionAndVelocity.position) {
    throw new Error('SGP4 propagation failed');
  }
  
  const gmst = satellite.gstime(date);
  const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
  
  const latitude = satellite.degreesLat(positionGd.latitude);
  const longitude = satellite.degreesLong(positionGd.longitude);
  const altitude = positionGd.height; // km above Earth

  // Calculate speed from ECI velocity vector (km/s -> km/h)
  const vel = positionAndVelocity.velocity;
  const speedKmPerSec = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);
  const speedKmPerHour = speedKmPerSec * 3600;

  return {
    latitude,
    longitude,
    altitude,
    speed: speedKmPerHour,
    timestamp: Math.floor(date.getTime() / 1000),
  };
}

/**
 * Main entry point: fetches TLE (cached) then computes position client-side.
 */
export const fetchISSLocation = async () => {
  const tle = await getTLE();
  const result = propagateISS(tle);
  
  return {
    message: 'success',
    iss_position: {
      latitude: result.latitude,
      longitude: result.longitude,
    },
    timestamp: result.timestamp,
    altitude: result.altitude,
    speed: result.speed,
  };
};

// --- Astronauts ---
// open-notify is HTTP-only so it fails on HTTPS deployments.
// We use a hardcoded manifest as a reliable fallback, updated from public sources.
const FALLBACK_ASTRONAUTS = [
  { name: 'Butch Wilmore', craft: 'ISS' },
  { name: 'Suni Williams', craft: 'ISS' },
  { name: 'Alexey Ovchinin', craft: 'ISS' },
  { name: 'Ivan Vagner', craft: 'ISS' },
  { name: 'Don Pettit', craft: 'ISS' },
  { name: 'Jonny Kim', craft: 'ISS' },
  { name: 'Takuya Onishi', craft: 'ISS' },
];

export const fetchAstronauts = async () => {
  try {
    // Try open-notify first (works locally / on HTTP origins)
    const response = await axios.get('http://api.open-notify.org/astros.json', { timeout: 3000 });
    if (response.data && response.data.message === 'success') {
      return response.data;
    }
  } catch {
    // Expected to fail on HTTPS deployments — silently fall back
  }
  
  // Reliable fallback
  return {
    message: 'success',
    number: FALLBACK_ASTRONAUTS.length,
    people: FALLBACK_ASTRONAUTS,
  };
};

// --- Reverse Geocoding ---
export const fetchNearestPlace = async (lat, lon) => {
  try {
    const response = await axios.get(NOMINATIM_API, {
      params: { lat, lon, format: 'json', zoom: 10 },
      headers: { 'User-Agent': 'AstroDash-ISS-Dashboard' },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearest place:", error);
    return null;
  }
};
