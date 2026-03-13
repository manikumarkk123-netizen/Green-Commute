import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMapPin, FiNavigation, FiZap, FiInfo, FiCrosshair } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createCustomIcon = (bgColor, emoji) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="background-color: ${bgColor}; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 2px 2px 10px rgba(0,0,0,0.5);">
            <span style="transform: rotate(45deg); font-size: 18px;">${emoji}</span>
           </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Custom Icons
const evIcon = createCustomIcon('#10b981', '⚡');
const fastEvIcon = createCustomIcon('#f59e0b', '⚡');
const pickupIcon = createCustomIcon('#3b82f6', '📍');
const dropoffIcon = createCustomIcon('#ef4444', '🏁');

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 0 4px rgba(59,130,246,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Map View updater component
function MapUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function RoutePlanner() {
  const { darkMode } = useTheme();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [stations, setStations] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Fast, Normal
  const [currentLocation, setCurrentLocation] = useState(null);

  // Google Maps Hybrid View
  const tileLayerUrl = "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}";

  const mapCenter = [20.5937, 78.9629]; // Default India

  const handleCurrentLocation = (setter) => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation([latitude, longitude]);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setter(data.display_name || `${latitude}, ${longitude}`);
        } catch (e) {
          setter(`${latitude}, ${longitude}`);
        } finally {
          setLoading(false);
        }
      }, () => {
        alert("Unable to retrieve your location");
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getCoordinates = async (address) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // lon, lat
    }
    throw new Error(`Location not found: ${address}`);
  };

  const decodePolyline = (str) => {
    let index = 0, lat = 0, lng = 0, coordinates = [];
    const factor = 1e5;
    while (index < str.length) {
      let b, shift = 0, result = 0;
      do {
        b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      coordinates.push([lat / factor, lng / factor]);
    }
    return coordinates;
  };

  const generateMockStations = (pathCoords) => {
    if (!pathCoords || pathCoords.length === 0) return [];
    
    // Generate 3-5 random stations near the route
    const numStations = Math.floor(Math.random() * 3) + 3; 
    const step = Math.floor(pathCoords.length / numStations);
    
    const mockStations = [];
    for (let i = 1; i <= numStations; i++) {
      const pointIndex = Math.min(step * i - Math.floor(step / 2), pathCoords.length - 1);
      const point = pathCoords[pointIndex];
      
      // Add slight random offset
      const offsetLat = (Math.random() - 0.5) * 0.05;
      const offsetLng = (Math.random() - 0.5) * 0.05;

      const isFast = Math.random() > 0.5;

      mockStations.push({
        id: i,
        name: `EcoCharge ${isFast ? 'Express' : 'Hub'} - ${i}`,
        position: [point[0] + offsetLat, point[1] + offsetLng],
        type: isFast ? 'Fast Charging (120kW)' : 'Normal Charging (22kW)',
        isFast: isFast,
        status: Math.random() > 0.2 ? 'Available' : 'In Use',
      });
    }
    return mockStations;
  };

  const handleRouteSearch = async (e) => {
    e.preventDefault();
    if (!pickup || !destination) return;
    setLoading(true);

    try {
      const [lon1, lat1] = await getCoordinates(pickup);
      const [lon2, lat2] = await getCoordinates(destination);

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full`;
      const res = await fetch(osrmUrl);
      const data = await res.json();

      if (data.code === 'Ok' && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(1);
        const timeMins = Math.round(route.duration / 60);

        const pathCoords = decodePolyline(route.geometry);
        const bounds = L.latLngBounds(pathCoords);

        setRouteData({
          distance: distanceKm,
          time: timeMins >= 60 ? `${(timeMins/60).toFixed(1)} hrs` : `${timeMins} mins`,
          path: pathCoords,
          bounds: bounds,
          start: [lat1, lon1],
          end: [lat2, lon2]
        });

        // Generate stations
        setStations(generateMockStations(pathCoords));
      } else {
        alert('Route could not be calculated');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error calculating route');
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = stations.filter(s => {
    if (filter === 'Fast') return s.isFast;
    if (filter === 'Normal') return !s.isFast;
    return true;
  });

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
          Smart Route Planner
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Plan your commute with real-time EV charging stations along your route. Optimize your travel for maximum eco-efficiency.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <FiNavigation className="text-emerald-500" /> Plan Journey
            </h2>
            <form onSubmit={handleRouteSearch} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Pickup</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-zinc-400" />
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Gateway of India, Mumbai"
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-2 pl-10 pr-12 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => handleCurrentLocation(setPickup)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-emerald-500 transition-colors"
                    title="Use Current Location"
                  >
                    <FiCrosshair />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Destination</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-emerald-500" />
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Pune Station"
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-2 pl-10 pr-12 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => handleCurrentLocation(setDestination)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-emerald-500 transition-colors"
                    title="Use Current Location"
                  >
                    <FiCrosshair />
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary flex justify-center items-center mt-2 disabled:opacity-50"
              >
                {loading ? 'Calculating Route...' : 'Find Route & Chargers'}
              </button>
            </form>
          </div>

          {routeData && (
            <div className="card space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiInfo className="text-emerald-500" /> Trip Overview
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <p className="text-sm text-emerald-400">Total Distance</p>
                  <p className="text-2xl font-bold text-white">{routeData.distance} km</p>
                </div>
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <p className="text-sm text-emerald-400">Est. Time</p>
                  <p className="text-2xl font-bold text-white">{routeData.time}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-1">Eco Recommendation</p>
                <p className="font-semibold text-white">
                  {parseFloat(routeData.distance) < 10 
                    ? "E-Bike or E-Scooter" 
                    : "Electric Car (e.g. Tata Nexon EV)"}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FiZap className="text-yellow-500" /> Nearby Chargers
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full font-bold">
                    {stations.length} Found
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {['All', 'Fast', 'Normal'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                        filter === f 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="lg:col-span-2 h-[600px] rounded-3xl overflow-hidden glass relative border border-white/10 shadow-2xl">
          <MapContainer 
            center={mapCenter} 
            zoom={5} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; Google Maps'
              url={tileLayerUrl}
            />
            
            {currentLocation && (
              <Marker position={currentLocation} icon={userLocationIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            
            {routeData && (
              <>
                <MapUpdater bounds={routeData.bounds} />
                <Polyline 
                  positions={routeData.path} 
                  pathOptions={{ color: '#10b981', weight: 5, opacity: 0.8 }} 
                />
                <Marker position={routeData.start} icon={pickupIcon}>
                  <Popup>Pickup Location</Popup>
                </Marker>
                <Marker position={routeData.end} icon={dropoffIcon}>
                  <Popup>Destination</Popup>
                </Marker>
              </>
            )}

            {filteredStations.map((station) => (
              <Marker 
                key={station.id} 
                position={station.position}
                icon={station.isFast ? fastEvIcon : evIcon}
              >
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-sm mb-1">{station.name}</h3>
                    <p className="text-xs text-zinc-500 mb-2">{station.type}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`px-2 py-1 rounded-full font-semibold ${
                        station.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {station.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
