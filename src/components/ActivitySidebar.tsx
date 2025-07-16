'use client';

import React from 'react';
import { X, ChevronRight, Clock, MapPin } from 'lucide-react';
import { IncidentData } from './Map';

interface ActivitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: IncidentData[];
  onIncidentClick: (incident: IncidentData) => void;
}

export default function ActivitySidebar({ isOpen, onClose, incidents, onIncidentClick }: ActivitySidebarProps) {
  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'checkpoint': return 'bg-orange-500';
      case 'raid': return 'bg-red-500';
      case 'detention': return 'bg-red-700';
      default: return 'bg-yellow-500';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const sortedIncidents = [...incidents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-transparent z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        onClick={onClose}
      />
      
      <div 
        className="fixed top-20 right-4 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl z-50 max-h-[70vh] flex flex-col animate-in fade-in slide-in-from-right-2 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 id="sidebar-title" className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none"
              aria-label="Close recent activity sidebar"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {sortedIncidents.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MapPin size={48} className="mx-auto mb-2 text-gray-300" />
              <p>No incidents reported yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {sortedIncidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => onIncidentClick(incident)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getIncidentTypeColor(incident.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize text-gray-700">
                          {incident.type}
                        </span>
                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span className="truncate">{incident.location}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Clock size={12} />
                          <span>{getTimeAgo(incident.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}