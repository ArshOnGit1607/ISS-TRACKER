import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSLocation, fetchNearestPlace } from '../services/iss';
import { calculateSpeed } from '../utils/haversine';
import toast from 'react-hot-toast';

export function useISSLocation(pollingInterval = 15000) {
  const [positions, setPositions] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
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
          
          if (updated.length >= 2) {
            const p1 = updated[updated.length - 2];
            const p2 = updated[updated.length - 1];
            const timeDiff = p2.timestamp - p1.timestamp;
            if (timeDiff > 0) {
              const speed = calculateSpeed(p1.lat, p1.lng, p2.lat, p2.lng, timeDiff);
              setCurrentSpeed(speed);
            }
          }
          
          return updated;
        });
        
        const placeData = await fetchNearestPlace(newPos.lat, newPos.lng);
        if (placeData && placeData.name) {
          setNearestPlace(placeData.name);
        } else if (placeData && placeData.address && placeData.address.country) {
          setNearestPlace(placeData.address.country);
        } else {
          setNearestPlace('Ocean / Unknown');
        }
        
        setError(null);
        if (isManual) toast.success('Tracker updated!');
      }
    } catch (err) {
      setError('Failed to fetch ISS location');
      if (isManual || isFirstLoad.current) toast.error('Failed to sync ISS telemetry');
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }, []);

  useEffect(() => {
    updateLocation();
    const intervalId = setInterval(updateLocation, pollingInterval);
    return () => clearInterval(intervalId);
  }, [updateLocation, pollingInterval]);

  return { 
    currentPos: positions[positions.length - 1] || null, 
    positions, 
    currentSpeed, 
    nearestPlace, 
    loading, 
    error,
    refresh: updateLocation
  };
}
