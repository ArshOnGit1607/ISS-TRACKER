import { useState, useEffect } from 'react';
import { fetchAstronauts } from '../services/iss';

export function useAstronauts() {
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const getAstronauts = async () => {
      try {
        const data = await fetchAstronauts();
        if (mounted && data.message === 'success') {
          const issCrew = data.people.filter(p => p.craft === 'ISS');
          setAstronauts(issCrew.length > 0 ? issCrew : data.people);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError('Failed to fetch astronauts');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getAstronauts();
    return () => { mounted = false; };
  }, []);

  return { astronauts, loading, error };
}
