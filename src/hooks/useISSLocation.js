import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSLocation, fetchNearestPlace } from '../services/iss';
import toast from 'react-hot-toast';

export function useISSLocation(pollingInterval = 5000) {
  const [positions, setPositions] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [altitude, setAltitude] = useState(null);
  const [nearestPlace, setNearestPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstLoad = useRef(true);
  
  const updateLocation = useCallback(async (isManual = false) => {
    try {
      const data = await fetchISSLocation();
      if (data.message === 'success') {
        const newPos = {
          lat: parseFloat(data.iss_position.latitude),
          lng: parseFloat(data.iss_position.longitude),
          timestamp: data.timestamp,
        };
        
        setPositions((prev) => {
          const updated = [...prev, newPos];
          if (updated.length > 15) {
            updated.shift();
          }
          return updated;
        });
        
        // Speed comes directly from SGP4 velocity vector — much more accurate
        if (data.speed) {
          setCurrentSpeed(data.speed);
        }
        
        if (data.altitude) {
          setAltitude(data.altitude);
        }
        
        // Only reverse-geocode every 15 seconds to respect Nominatim rate limits
        if (isFirstLoad.current || isManual || !nearestPlace) {
          const placeData = await fetchNearestPlace(newPos.lat, newPos.lng);
          if (placeData && placeData.name) {
            setNearestPlace(placeData.name);
          } else if (placeData && placeData.address && placeData.address.country) {
            setNearestPlace(placeData.address.country);
          } else {
            setNearestPlace('Ocean / Unknown');
          }
        }
        
        setError(null);
        if (isManual) toast.success('Telemetry synced!');
      }
    } catch (err) {
      setError('Failed to compute ISS position');
      if (isManual || isFirstLoad.current) toast.error('Telemetry sync failed');
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }, [nearestPlace]);

  // Reverse geocode on a slower cadence (every 30s)
  useEffect(() => {
    const currentPos = positions[positions.length - 1];
    if (!currentPos) return;
    
    const geoInterval = setInterval(async () => {
      const placeData = await fetchNearestPlace(currentPos.lat, currentPos.lng);
      if (placeData && placeData.name) {
        setNearestPlace(placeData.name);
      } else if (placeData && placeData.address && placeData.address.country) {
        setNearestPlace(placeData.address.country);
      }
    }, 30000);

    return () => clearInterval(geoInterval);
  }, [positions.length]);

  useEffect(() => {
    updateLocation();
    const intervalId = setInterval(updateLocation, pollingInterval);
    return () => clearInterval(intervalId);
  }, [updateLocation, pollingInterval]);

  return { 
    currentPos: positions[positions.length - 1] || null, 
    positions, 
    currentSpeed, 
    altitude,
    nearestPlace, 
    loading, 
    error,
    refresh: updateLocation
  };
}
