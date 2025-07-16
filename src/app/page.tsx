'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Settings, Menu, Search, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import Map, { IncidentData } from '@/components/Map';
import ReportModal, { ReportData } from '@/components/ReportModal';
import ActivitySidebar from '@/components/ActivitySidebar';
import IncidentDetailModal from '@/components/IncidentDetailModal';

// Generated from extracted_padlet_addresses.csv (first 50 entries)
// 50 incidents spanning from 7/15/2025, 10:12:29 PM to 7/16/2025, 6:11:29 AM
const mockIncidents: IncidentData[] = [
  {
    id: '1',
    lat: 39.7285,
    lng: -121.8375,
    type: 'detention',
    description: 'Detention witnessed at Chico, ca during routine stop.',
    timestamp: new Date('2025-07-16T06:11:29.426Z'),
    location: 'Chico, ca'
  },
  {
    id: '2',
    lat: 39.7285,
    lng: -121.8375,
    type: 'checkpoint',
    description: 'Mobile checkpoint spotted at Chico, CA. Traffic being diverted.',
    timestamp: new Date('2025-07-16T06:01:42.895Z'),
    location: 'Chico, CA'
  },
  {
    id: '3',
    lat: 29.3116,
    lng: -96.1025,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near Wharton, TX. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T05:51:56.364Z'),
    location: 'Wharton, TX'
  },
  {
    id: '4',
    lat: 33.037,
    lng: -117.292,
    type: 'raid',
    description: 'ICE raid operation at Encinitas, CA. Multiple detentions witnessed.',
    timestamp: new Date('2025-07-16T05:42:09.834Z'),
    location: 'Encinitas, CA'
  },
  {
    id: '5',
    lat: 29.7604,
    lng: -95.3698,
    type: 'detention',
    description: 'Person taken into custody at {In-N-Out Burger, North 1200 West, La.',
    timestamp: new Date('2025-07-16T05:32:23.303Z'),
    location: '{In-N-Out Burger, North 1200 West, La'
  },
  {
    id: '6',
    lat: 37.7749,
    lng: -122.4194,
    type: 'checkpoint',
    description: 'Checkpoint activity reported at In-N-Out Burger, North 1200. Drivers being questioned.',
    timestamp: new Date('2025-07-16T05:22:36.772Z'),
    location: 'In-N-Out Burger, North 1200'
  },
  {
    id: '7',
    lat: 30.2672,
    lng: -97.7431,
    type: 'detention',
    description: 'Person taken into custody at CChase Bank, Foothill Boulevard, Syima,.',
    timestamp: new Date('2025-07-16T05:12:50.242Z'),
    location: 'CChase Bank, Foothill Boulevard, Syima,'
  },
  {
    id: '8',
    lat: 30.2672,
    lng: -97.7431,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at Chase Bank, Foothill Boulevard,.',
    timestamp: new Date('2025-07-16T05:03:03.711Z'),
    location: 'Chase Bank, Foothill Boulevard,'
  },
  {
    id: '9',
    lat: 37.7749,
    lng: -122.4194,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at \'The Source 0, Beach Boulevard, Bu.',
    timestamp: new Date('2025-07-16T04:53:17.181Z'),
    location: '\'The Source 0, Beach Boulevard, Bu'
  },
  {
    id: '10',
    lat: 30.2672,
    lng: -97.7431,
    type: 'checkpoint',
    description: 'Checkpoint activity reported at The Source OC, Beach Boulever.. Drivers being questioned.',
    timestamp: new Date('2025-07-16T04:43:30.650Z'),
    location: 'The Source OC, Beach Boulever.'
  },
  {
    id: '11',
    lat: 35.7887,
    lng: -83.9738,
    type: 'detention',
    description: 'Person taken into custody at Alcoa, TN.',
    timestamp: new Date('2025-07-16T04:33:44.119Z'),
    location: 'Alcoa, TN'
  },
  {
    id: '12',
    lat: 33.8366,
    lng: -117.9143,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near IN Coffman st, Anaheim, CA. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T04:23:57.589Z'),
    location: 'IN Coffman st, Anaheim, CA'
  },
  {
    id: '13',
    lat: 33.8366,
    lng: -117.9143,
    type: 'raid',
    description: 'Business raid reported at N Coffman St, Anaheim, CA. Area cordoned off.',
    timestamp: new Date('2025-07-16T04:14:11.058Z'),
    location: 'N Coffman St, Anaheim, CA'
  },
  {
    id: '14',
    lat: 32.7767,
    lng: -96.797,
    type: 'checkpoint',
    description: 'Checkpoint activity reported at 188 $ State College Bld, Anaheim, C.. Drivers being questioned.',
    timestamp: new Date('2025-07-16T04:04:24.528Z'),
    location: '188 $ State College Bld, Anaheim, C.'
  },
  {
    id: '15',
    lat: 34.0522,
    lng: -118.2437,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near 188 S State Collage Blvd,. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T03:54:37.997Z'),
    location: '188 S State Collage Blvd,'
  },
  {
    id: '16',
    lat: 29.7604,
    lng: -95.3698,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at In.',
    timestamp: new Date('2025-07-16T03:44:51.466Z'),
    location: 'In'
  },
  {
    id: '17',
    lat: 33.7414,
    lng: -118.1048,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at Dut Burger, Seal Beach Boulevar..',
    timestamp: new Date('2025-07-16T03:35:04.936Z'),
    location: 'Dut Burger, Seal Beach Boulevar.'
  },
  {
    id: '18',
    lat: 33.7414,
    lng: -118.1048,
    type: 'detention',
    description: 'Individual detained at In-N-Out Burger, Seal Beach. Family members requesting assistance.',
    timestamp: new Date('2025-07-16T03:25:18.405Z'),
    location: 'In-N-Out Burger, Seal Beach'
  },
  {
    id: '19',
    lat: 33.4936,
    lng: -117.1484,
    type: 'raid',
    description: 'ICE raid operation at Los Ranchites, Temecula, CA, USA. Multiple detentions witnessed.',
    timestamp: new Date('2025-07-16T03:15:31.874Z'),
    location: 'Los Ranchites, Temecula, CA, USA'
  },
  {
    id: '20',
    lat: 33.4936,
    lng: -117.1484,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at Los Ranchitos, Temecula, CA, USA.',
    timestamp: new Date('2025-07-16T03:05:45.344Z'),
    location: 'Los Ranchitos, Temecula, CA, USA'
  },
  {
    id: '21',
    lat: 31.0982,
    lng: -97.3428,
    type: 'other',
    description: 'Potential ICE activity at Temple, TX.',
    timestamp: new Date('2025-07-16T02:55:58.813Z'),
    location: 'Temple, TX'
  },
  {
    id: '22',
    lat: 36.9888,
    lng: -121.9566,
    type: 'detention',
    description: 'Individual detained at Safeway, 41st Avenue, Soquel, CA. Family members requesting assistance.',
    timestamp: new Date('2025-07-16T02:46:12.283Z'),
    location: 'Safeway, 41st Avenue, Soquel, CA'
  },
  {
    id: '23',
    lat: 40.8176,
    lng: -73.9482,
    type: 'raid',
    description: 'Workplace raid in progress at 139 Lenox Avenue, New York, NY. Large ICE presence with multiple vehicles.',
    timestamp: new Date('2025-07-16T02:36:25.752Z'),
    location: '139 Lenox Avenue, New York, NY'
  },
  {
    id: '24',
    lat: 40.8176,
    lng: -73.9482,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at 189 Lenox Avenue, New York, NY.',
    timestamp: new Date('2025-07-16T02:26:39.221Z'),
    location: '189 Lenox Avenue, New York, NY'
  },
  {
    id: '25',
    lat: 30.2672,
    lng: -97.7431,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near Beaverton, Oregén 97005, EE. UU. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T02:16:52.691Z'),
    location: 'Beaverton, Oregén 97005, EE. UU'
  },
  {
    id: '26',
    lat: 29.7604,
    lng: -95.3698,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near Beaverton, Oregén 97005, EE. UU.. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T02:07:06.160Z'),
    location: 'Beaverton, Oregén 97005, EE. UU.'
  },
  {
    id: '27',
    lat: 29.7604,
    lng: -95.3698,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near Costco Business Center, South Bent A.. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T01:57:19.630Z'),
    location: 'Costco Business Center, South Bent A.'
  },
  {
    id: '28',
    lat: 32.7767,
    lng: -96.797,
    type: 'raid',
    description: 'Business raid reported at Costco Business Center, South. Area cordoned off.',
    timestamp: new Date('2025-07-16T01:47:33.099Z'),
    location: 'Costco Business Center, South'
  },
  {
    id: '29',
    lat: 34.0522,
    lng: -118.2437,
    type: 'checkpoint',
    description: 'Mobile checkpoint spotted at 1-110, Los Angeles, CA 90003, USA. Traffic being diverted.',
    timestamp: new Date('2025-07-16T01:37:46.568Z'),
    location: '1-110, Los Angeles, CA 90003, USA'
  },
  {
    id: '30',
    lat: 34.0522,
    lng: -118.2437,
    type: 'raid',
    description: 'Business raid reported at T-110, Los Angeles, CA 90003,. Area cordoned off.',
    timestamp: new Date('2025-07-16T01:28:00.038Z'),
    location: 'T-110, Los Angeles, CA 90003,'
  },
  {
    id: '31',
    lat: 33.4484,
    lng: -112.074,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near \'564-698 N Kingsley Dr, Los Angeles,. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T01:18:13.507Z'),
    location: '\'564-698 N Kingsley Dr, Los Angeles,'
  },
  {
    id: '32',
    lat: 29.7604,
    lng: -95.3698,
    type: 'detention',
    description: 'Multiple detentions reported near 564-698 N Kingsley Dr, Los.',
    timestamp: new Date('2025-07-16T01:08:26.977Z'),
    location: '564-698 N Kingsley Dr, Los'
  },
  {
    id: '33',
    lat: 41.2709,
    lng: -73.7774,
    type: 'detention',
    description: 'Individual detained at Yorktown, NY. Family members requesting assistance.',
    timestamp: new Date('2025-07-16T00:58:40.446Z'),
    location: 'Yorktown, NY'
  },
  {
    id: '34',
    lat: 38.9399,
    lng: -119.9772,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near South Lake Tahoe, CA. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-16T00:48:53.915Z'),
    location: 'South Lake Tahoe, CA'
  },
  {
    id: '35',
    lat: 34.0122,
    lng: -117.6889,
    type: 'detention',
    description: 'Person taken into custody at 12015 Central Avenue, Chino, CA.',
    timestamp: new Date('2025-07-16T00:39:07.385Z'),
    location: '12015 Central Avenue, Chino, CA'
  },
  {
    id: '36',
    lat: 34.0122,
    lng: -117.6889,
    type: 'raid',
    description: 'ICE raid operation at 12013 Central Avenue, Chino, CA. Multiple detentions witnessed.',
    timestamp: new Date('2025-07-16T00:29:20.854Z'),
    location: '12013 Central Avenue, Chino, CA'
  },
  {
    id: '37',
    lat: 40.6782,
    lng: -73.9442,
    type: 'raid',
    description: 'Business raid reported at Brooklyn, NY. Area cordoned off.',
    timestamp: new Date('2025-07-16T00:19:34.323Z'),
    location: 'Brooklyn, NY'
  },
  {
    id: '38',
    lat: 29.4241,
    lng: -98.4936,
    type: 'detention',
    description: 'Individual detained at Brookiyn, NY. Family members requesting assistance.',
    timestamp: new Date('2025-07-16T00:09:47.793Z'),
    location: 'Brookiyn, NY'
  },
  {
    id: '39',
    lat: 40.7128,
    lng: -74.006,
    type: 'detention',
    description: 'Multiple detentions reported near Westminster Ave,.',
    timestamp: new Date('2025-07-16T00:00:01.262Z'),
    location: 'Westminster Ave,'
  },
  {
    id: '40',
    lat: 41.8781,
    lng: -87.6298,
    type: 'raid',
    description: 'ICE raid operation at den Grove,. Multiple detentions witnessed.',
    timestamp: new Date('2025-07-15T23:50:14.732Z'),
    location: 'den Grove,'
  },
  {
    id: '41',
    lat: 29.7604,
    lng: -95.3698,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at 9..',
    timestamp: new Date('2025-07-15T23:40:28.201Z'),
    location: '9.'
  },
  {
    id: '42',
    lat: 33.7739,
    lng: -117.9415,
    type: 'raid',
    description: 'Workplace raid in progress at Westminster Ave, Garden Grove,.. Large ICE presence with multiple vehicles.',
    timestamp: new Date('2025-07-15T23:30:41.670Z'),
    location: 'Westminster Ave, Garden Grove,.'
  },
  {
    id: '43',
    lat: 33.9022,
    lng: -118.0817,
    type: 'raid',
    description: 'ICE raid operation at \'San Gabriel River Fwy, Norwalk, CA 9.. Multiple detentions witnessed.',
    timestamp: new Date('2025-07-15T23:20:55.140Z'),
    location: '\'San Gabriel River Fwy, Norwalk, CA 9.'
  },
  {
    id: '44',
    lat: 29.4241,
    lng: -98.4936,
    type: 'detention',
    description: 'Individual detained at \'San Gabriel River Fwy, Norwalk,. Family members requesting assistance.',
    timestamp: new Date('2025-07-15T23:11:08.609Z'),
    location: '\'San Gabriel River Fwy, Norwalk,'
  },
  {
    id: '45',
    lat: 34.0553,
    lng: -117.75,
    type: 'detention',
    description: 'Person taken into custody at 14670 Indian Hil Boulevard, Pomona, CA.',
    timestamp: new Date('2025-07-15T23:01:22.079Z'),
    location: '14670 Indian Hil Boulevard, Pomona, CA'
  },
  {
    id: '46',
    lat: 34.0522,
    lng: -118.2437,
    type: 'detention',
    description: 'Individual detained at 1670 Indian Hil Boulevard,. Family members requesting assistance.',
    timestamp: new Date('2025-07-15T22:51:35.548Z'),
    location: '1670 Indian Hil Boulevard,'
  },
  {
    id: '47',
    lat: 33.4484,
    lng: -112.074,
    type: 'checkpoint',
    description: 'Checkpoint with multiple ICE vehicles at U.S. ICE, Homeland Security Investig..',
    timestamp: new Date('2025-07-15T22:41:49.017Z'),
    location: 'U.S. ICE, Homeland Security Investig.'
  },
  {
    id: '48',
    lat: 32.7767,
    lng: -96.797,
    type: 'checkpoint',
    description: 'Routine checkpoint operation at US. ICE, Homeland Security.',
    timestamp: new Date('2025-07-15T22:32:02.487Z'),
    location: 'US. ICE, Homeland Security'
  },
  {
    id: '49',
    lat: 40.8537,
    lng: -73.4096,
    type: 'raid',
    description: 'Workplace raid in progress at Huntington Station, NY. Large ICE presence with multiple vehicles.',
    timestamp: new Date('2025-07-15T22:22:15.956Z'),
    location: 'Huntington Station, NY'
  },
  {
    id: '50',
    lat: 34.0122,
    lng: -117.6889,
    type: 'checkpoint',
    description: 'Immigration checkpoint set up near Dolar Tree, Central Avenue, Chino, CA. Multiple vehicles being stopped and checked.',
    timestamp: new Date('2025-07-15T22:12:29.426Z'),
    location: 'Dolar Tree, Central Avenue, Chino, CA'
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
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    if (!mapRef.current) return;

    // Check if we're on HTTPS or localhost (required for geolocation on mobile)
    if (typeof window !== 'undefined' && 
        window.location.protocol !== 'https:' && 
        !window.location.hostname.includes('localhost') && 
        window.location.hostname !== '127.0.0.1') {
      alert('Location services require a secure connection (HTTPS).');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 13
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'Please enable location services and try again.';
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
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
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-30 pb-20 sm:pb-8">
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-orange-300 focus:outline-none touch-manipulation"
          style={{ marginBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
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
