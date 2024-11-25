'use client'

import axiosInstance from '@/app/api/axiosInstance';
import React, { useState, useEffect } from 'react';

const RadiusConfigScreen: React.FC = () => {
    const [currentRadiusValue, setCurrentRadiusValue] = useState<number>(0);
  const [radiusValue, setRadiusValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial radius setting
  useEffect(() => {
    const fetchRadiusSettings = async () => {
      try {
        const response = await axiosInstance.get('settings/radius');
        setCurrentRadiusValue(response.data);
        setRadiusValue(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch radius settings');
        setIsLoading(false);
      }
    };

    fetchRadiusSettings();
  }, []);

  // Update radius setting
  const handleUpdateRadius = async () => {
    try {
      const res = await axiosInstance.put('settings/radius', radiusValue);
      if (res.data) {
        alert('Radius updated successfully');
        setCurrentRadiusValue(radiusValue);
      }
    } catch (err) {
      setError('Failed to update radius settings');
    }
  };

  if (isLoading) return <div className="text-orange-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-32">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Radius Configuration</h2>
      <h3 className="text-2xl font-bold text-orange-500 mb-6">Current value: {currentRadiusValue}</h3>
      
      <div className="mb-4">
        <label htmlFor="radius" className="block text-orange-700 mb-2">
          Radius Value
        </label>
        <input 
          type="number" 
          id="radius"
          value={radiusValue} 
          onChange={(e) => setRadiusValue(Number(e.target.value))}
          className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      
      <button 
        onClick={handleUpdateRadius}
        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
      >
        Update Radius
      </button>
    </div>
  );
};

export default RadiusConfigScreen;