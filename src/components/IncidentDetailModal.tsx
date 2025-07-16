'use client';

import { X, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { IncidentData } from './Map';

interface IncidentDetailModalProps {
  incident: IncidentData | null;
  onClose: () => void;
}

export default function IncidentDetailModal({ incident, onClose }: IncidentDetailModalProps) {
  if (!incident) return null;

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'checkpoint': return '🚧';
      case 'raid': return '🚨';
      case 'detention': return '⚠️';
      default: return '📍';
    }
  };

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'checkpoint': return 'text-orange-600 bg-orange-50';
      case 'raid': return 'text-red-600 bg-red-50';
      case 'detention': return 'text-red-700 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div 
      className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getIncidentTypeIcon(incident.type)}</span>
            <h2 className="text-lg font-semibold capitalize text-gray-800">{incident.type}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getIncidentTypeColor(incident.type)}`}>
            <AlertTriangle size={14} className="mr-1" />
            {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)} Reported
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {incident.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Location</h4>
                <p className="text-gray-600 text-sm">{incident.location}</p>
                <p className="text-gray-400 text-xs">
                  {incident.lat?.toFixed(4)}, {incident.lng?.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Reported</h4>
                <p className="text-gray-600 text-sm">{formatDateTime(incident.timestamp)}</p>
                <p className="text-gray-400 text-xs">{getTimeAgo(incident.timestamp)}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Trust Score</span>
                <span className="font-medium text-gray-400">
                  {/* TODO: Implement trust score system */}
                  Coming soon
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              onClick={() => {
                // TODO: Implement upvote/verification system
                console.log('Verify incident:', incident.id);
              }}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}