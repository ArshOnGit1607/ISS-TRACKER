import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issue in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export function ISSMap({ positions, currentPos }) {
  if (!currentPos) return <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>;

  const trajectory = positions.map(pos => [pos.lat, pos.lng]);

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700" style={{ zIndex: 0 }}>
      <MapContainer 
        center={[currentPos.lat, currentPos.lng]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={trajectory} color="blue" weight={3} />
        <Marker position={[currentPos.lat, currentPos.lng]}>
          <Popup>
            ISS Current Position <br />
            Lat: {currentPos.lat.toFixed(4)} <br />
            Lng: {currentPos.lng.toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
