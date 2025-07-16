'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';

// Mapbox API token from environment variables
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Debug logging for development
if (typeof window !== 'undefined') {
  console.log('Mapbox token loaded:', mapboxgl.accessToken ? 'Yes' : 'No');
  console.log('Token starts with pk.:', mapboxgl.accessToken.startsWith('pk.'));
}

export interface IncidentData {
  id: string;
  lat: number;
  lng: number;
  type: 'checkpoint' | 'raid' | 'detention' | 'other';
  description: string;
  timestamp: Date;
  location: string;
}

interface MapProps {
  incidents: IncidentData[];
  onIncidentClick: (incident: IncidentData) => void;
}

interface MapRef {
  zoomIn: () => void;
  zoomOut: () => void;
  flyTo: (options: { center: [number, number]; zoom: number }) => void;
  getCenter: () => { lng: number; lat: number } | undefined;
  getZoom: () => number | undefined;
  resize: () => void;
}

const Map = forwardRef<MapRef, MapProps>(({ incidents, onIncidentClick }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-118.2437);
  const [lat, setLat] = useState(34.0522);
  const [zoom, setZoom] = useState(9);
  const [mapError, setMapError] = useState(false);

  // Expose map methods to parent component
  useImperativeHandle(ref, () => ({
    zoomIn: () => map.current?.zoomIn(),
    zoomOut: () => map.current?.zoomOut(),
    flyTo: (options: { center: [number, number]; zoom: number }) => map.current?.flyTo(options),
    getCenter: () => map.current?.getCenter(),
    getZoom: () => map.current?.getZoom(),
    resize: () => {
      if (map.current) {
        map.current.resize();
      }
    },
  }));

  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [lng, lat],
          zoom: zoom,
          attributionControl: false,
          preserveDrawingBuffer: true,
          antialias: true,
        });

        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
          setMapError(true);
        });

        map.current.on('load', () => {
          console.log('Map loaded successfully');
          if (map.current) {
            map.current.resize();
          }
        });

        map.current.on('move', () => {
          if (map.current) {
            setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
            setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
            setZoom(parseFloat(map.current.getZoom().toFixed(2)));
          }
        });

        // Controls will be added via custom UI components
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !incidents.length) return;

    map.current.on('load', () => {
      if (!map.current) return;

      // Add heatmap data source
      map.current.addSource('incidents', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: incidents.map(incident => ({
            type: 'Feature',
            properties: {
              id: incident.id,
              type: incident.type,
              description: incident.description,
              timestamp: incident.timestamp.toISOString(),
              location: incident.location,
            },
            geometry: {
              type: 'Point',
              coordinates: [incident.lng, incident.lat]
            }
          }))
        }
      });

      // Add heatmap layer with improved visibility
      map.current.addLayer({
        id: 'incidents-heatmap',
        type: 'heatmap',
        source: 'incidents',
        maxzoom: 16,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            16, 5
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(255,107,53,0)',
            0.1, 'rgba(255,107,53,0.2)',
            0.3, 'rgba(255,107,53,0.4)',
            0.5, 'rgba(255,69,0,0.6)',
            0.7, 'rgba(220,20,60,0.8)',
            1, 'rgba(178,24,43,1)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 20,
            10, 40,
            16, 80
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 0.8,
            16, 0.6
          ]
        }
      });

      // Add circle layer for individual points
      map.current.addLayer({
        id: 'incidents-point',
        type: 'circle',
        source: 'incidents',
        minzoom: 14,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, ['interpolate', ['linear'], ['get', 'magnitude'], 1, 1, 6, 4],
            16, ['interpolate', ['linear'], ['get', 'magnitude'], 1, 5, 6, 50]
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'type'], 'checkpoint'], '#ff6b35',
            ['==', ['get', 'type'], 'raid'], '#e74c3c',
            ['==', ['get', 'type'], 'detention'], '#c0392b',
            '#f39c12'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0,
            15, 1
          ]
        }
      });

      // Add click event for incidents
      map.current.on('click', 'incidents-point', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const incident = incidents.find(i => i.id === feature.properties?.id);
          if (incident) {
            onIncidentClick(incident);
          }
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'incidents-point', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'incidents-point', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    });
  }, [incidents, onIncidentClick]);

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (mapError) {
    return (
      <div className="relative w-full h-full bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold mb-2">Map temporarily unavailable</h3>
          <p className="text-gray-600 mb-4">
            Unable to load map. This might be due to missing API keys.
          </p>
          <div className="grid gap-4 max-w-md">
            {incidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => onIncidentClick(incident)}
                className="p-4 bg-white rounded-lg shadow text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    incident.type === 'checkpoint' ? 'bg-orange-500' :
                    incident.type === 'raid' ? 'bg-red-500' :
                    incident.type === 'detention' ? 'bg-red-700' : 'bg-yellow-500'
                  }`} />
                  <span className="font-medium capitalize">{incident.type}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{incident.location}</p>
                <p className="text-xs text-gray-500">{incident.timestamp.toLocaleTimeString()}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          position: 'relative',
          overflow: 'hidden'
        }}
      />
    </div>
  );
});

Map.displayName = 'Map';

export default Map;