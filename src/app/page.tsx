'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Settings, Menu, Search, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import Map, { IncidentData } from '@/components/Map';
import ReportModal, { ReportData } from '@/components/ReportModal';
import ActivitySidebar from '@/components/ActivitySidebar';
import IncidentDetailModal from '@/components/IncidentDetailModal';

// Mock data for testing - more incidents to create visible heatmap hotspots
const mockIncidents: IncidentData[] = [
  // Times Square area cluster
  {
    id: '1',
    lat: 40.7580,
    lng: -73.9855,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up at intersection. Multiple vehicles being stopped and checked.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    location: 'Times Square, Manhattan'
  },
  {
    id: '2',
    lat: 40.7575,
    lng: -73.9860,
    type: 'checkpoint',
    description: 'Additional checkpoint vehicles spotted nearby.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    location: 'Times Square South, Manhattan'
  },
  {
    id: '3',
    lat: 40.7585,
    lng: -73.9850,
    type: 'detention',
    description: 'Detention witnessed near subway entrance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    location: 'Times Square North, Manhattan'
  },
  {
    id: '4',
    lat: 40.7570,
    lng: -73.9865,
    type: 'checkpoint',
    description: 'Ongoing checkpoint activity.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    location: 'Herald Square, Manhattan'
  },
  
  // Midtown cluster
  {
    id: '5',
    lat: 40.7505,
    lng: -73.9934,
    type: 'raid',
    description: 'Workplace raid in progress. Large ICE presence with multiple vehicles.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    location: 'Midtown West, Manhattan'
  },
  {
    id: '6',
    lat: 40.7510,
    lng: -73.9940,
    type: 'raid',
    description: 'Additional vehicles arrived at raid location.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2),
    location: 'Midtown West, Manhattan'
  },
  {
    id: '7',
    lat: 40.7500,
    lng: -73.9930,
    type: 'checkpoint',
    description: 'Checkpoint set up near raid location.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    location: 'Midtown West, Manhattan'
  },
  
  // Jackson Heights cluster
  {
    id: '8',
    lat: 40.7282,
    lng: -73.7949,
    type: 'detention',
    description: 'Individual detained during routine traffic stop. Family members requesting assistance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    location: 'Jackson Heights, Queens'
  },
  {
    id: '9',
    lat: 40.7290,
    lng: -73.7945,
    type: 'checkpoint',
    description: 'Checkpoint spotted near Roosevelt Avenue.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
    location: 'Jackson Heights, Queens'
  },
  {
    id: '10',
    lat: 40.7275,
    lng: -73.7955,
    type: 'detention',
    description: 'Multiple detentions reported in the area.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    location: 'Jackson Heights, Queens'
  },
  {
    id: '11',
    lat: 40.7285,
    lng: -73.7940,
    type: 'checkpoint',
    description: 'Mobile checkpoint moving through area.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5),
    location: 'Jackson Heights, Queens'
  },
  
  // Brooklyn cluster
  {
    id: '12',
    lat: 40.6892,
    lng: -74.0445,
    type: 'checkpoint',
    description: 'Checkpoint reported near subway station entrance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    location: 'Bay Ridge, Brooklyn'
  },
  {
    id: '13',
    lat: 40.6885,
    lng: -74.0450,
    type: 'checkpoint',
    description: 'Extended checkpoint operation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6.5),
    location: 'Bay Ridge, Brooklyn'
  },
  {
    id: '14',
    lat: 40.6900,
    lng: -74.0440,
    type: 'detention',
    description: 'Detention near local businesses.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
    location: 'Bay Ridge, Brooklyn'
  },
  
  // Additional scattered incidents
  {
    id: '15',
    lat: 40.7128,
    lng: -74.0060,
    type: 'checkpoint',
    description: 'Downtown checkpoint activity.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    location: 'Lower Manhattan'
  },
  {
    id: '16',
    lat: 40.7589,
    lng: -73.9851,
    type: 'other',
    description: 'Suspicious activity reported by community.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    location: 'Theater District, Manhattan'
  },
  {
    id: '17',
    lat: 40.7614,
    lng: -73.9776,
    type: 'checkpoint',
    description: 'Checkpoint near Central Park.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
    location: 'Upper West Side, Manhattan'
  },
  {
    id: '18',
    lat: 40.6782,
    lng: -73.9442,
    type: 'raid',
    description: 'Business raid in Prospect Heights.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    location: 'Prospect Heights, Brooklyn'
  }
];

export default function Home() {
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    flyTo: (options: { center: [number, number]; zoom: number }) => void;
    getCenter: () => { lng: number; lat: number };
    getZoom: () => number;
    resize: () => void;
  } | null>(null);

  useEffect(() => {
    // Load mock data on component mount
    setIncidents(mockIncidents);
  }, []);

  // Force map refresh when modals open/close
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current && mapRef.current.resize) {
        mapRef.current.resize();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isReportModalOpen, isSidebarOpen, selectedIncident]);

  const handleReportSubmit = (reportData: ReportData) => {
    const newIncident: IncidentData = {
      id: Date.now().toString(),
      lat: reportData.lat || 40.7128,
      lng: reportData.lng || -74.006,
      type: reportData.type,
      description: reportData.description,
      timestamp: new Date(),
      location: reportData.location
    };

    setIncidents(prev => [newIncident, ...prev]);
    // TODO: Submit to backend API
  };

  const handleIncidentClick = (incident: IncidentData) => {
    setSelectedIncident(incident);
    setIsSidebarOpen(false);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleCenterLocation = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition((position) => {
        mapRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 14
        });
      });
    }
  };

  return (
    <main className="h-screen relative overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 z-10">
        <Map 
          ref={mapRef}
          incidents={incidents}
          onIncidentClick={handleIncidentClick}
        />
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-[30%] right-4 z-30 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none"
          aria-label="Zoom in"
        >
          <ZoomIn size={20} className="text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none"
          aria-label="Zoom out"
        >
          <ZoomOut size={20} className="text-gray-700" />
        </button>
        <button
          onClick={handleCenterLocation}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none"
          aria-label="Center on my location"
        >
          <Navigation size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Top UI Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Settings and Search */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md lg:max-w-lg">
            {/* Settings Icon */}
            <button 
              className="p-2.5 sm:p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none flex-shrink-0"
              aria-label="Open settings"
              onClick={() => {
                // TODO: Implement settings modal
                console.log('Settings clicked');
              }}
            >
              <Settings size={18} className="sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <label htmlFor="location-search" className="sr-only">Search location</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="location-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-full shadow-lg border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm sm:text-base text-gray-800 placeholder-gray-500"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Right Side - Activity Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 sm:p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors relative focus:ring-2 focus:ring-orange-500 focus:outline-none flex-shrink-0"
            aria-label={`View recent activity (${incidents.length} incidents)`}
          >
            <Menu size={18} className="sm:w-5 sm:h-5 text-gray-700" />
            {incidents.length > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold"
                aria-hidden="true"
              >
                {incidents.length > 9 ? '9+' : incidents.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Report ICE Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 pb-safe">
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-orange-300 focus:outline-none touch-manipulation"
          aria-label="Report ICE activity"
        >
          <Plus size={18} />
          <span className="text-sm sm:text-base">Report ICE</span>
        </button>
      </div>

      {/* Modals and Sidebars */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      <ActivitySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        incidents={incidents}
        onIncidentClick={handleIncidentClick}
      />

      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </main>
  );
}
