'use client';

import { useState } from 'react';
import { X, MapPin, Upload } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportData) => void;
}

export interface ReportData {
  type: 'checkpoint' | 'raid' | 'detention' | 'other';
  description: string;
  location: string;
  lat?: number;
  lng?: number;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [formData, setFormData] = useState<ReportData>({
    type: 'checkpoint',
    description: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit incident to backend here
    onSubmit(formData);
    setFormData({
      type: 'checkpoint',
      description: '',
      location: '',
    });
    onClose();
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (!isOpen) return null;

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
          <h2 className="text-lg font-semibold text-gray-800">Report Incident</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Incident Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'checkpoint', label: 'Checkpoint' },
                { value: 'raid', label: 'Raid' },
                { value: 'detention', label: 'Detention' },
                { value: 'other', label: 'Other' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value as ReportData['type'] }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.type === type.value
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location or address"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800"
                required
              />
              <button
                type="button"
                onClick={handleLocationDetect}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Detect current location"
              >
                <MapPin size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide details about the incident..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Media (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload size={24} className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-600">
                Tap to upload photo or video
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                // TODO: Handle file upload
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}