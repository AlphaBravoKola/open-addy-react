import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Property, PropertyInstructions } from '../types';

interface FormData {
  name: string;
  address: string;
  unit_count: string | number;
  property_type: string;
  authorized_services: string[];
  instructions: {
    package_location: string;
    access_code: string;
    access_notes: string;
    special_instructions: string;
  };
}

const DELIVERY_SERVICES = ['UPS', 'USPS', 'FedEx', 'Amazon', 'DHL'];

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'landlord_id'>) => void;
  property?: Property;
}

export default function PropertyModal({ isOpen, onClose, onSave, property }: PropertyModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: property?.name || '',
    address: property?.address || '',
    unit_count: property?.unit_count || '',
    property_type: property?.property_type || '',
    authorized_services: property?.authorized_services || [],
    instructions: {
      package_location: property?.instructions?.package_location || '',
      access_code: property?.instructions?.access_code || '',
      access_notes: property?.instructions?.access_notes || '',
      special_instructions: property?.instructions?.special_instructions || ''
    }
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || '',
        address: property.address || '',
        unit_count: property.unit_count?.toString() || '',
        property_type: property.property_type || '',
        authorized_services: property.authorized_services || [],
        instructions: {
          package_location: property.instructions?.package_location || '',
          access_code: property.instructions?.access_code || '',
          access_notes: property.instructions?.access_notes || '',
          special_instructions: property.instructions?.special_instructions || ''
        }
      });
    } else {
      resetForm();
    }
  }, [property]);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      unit_count: '',
      property_type: '',
      authorized_services: [],
      instructions: {
        package_location: '',
        access_code: '',
        access_notes: '',
        special_instructions: ''
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'landlord_id'> = {
      name: formData.name,
      address: formData.address,
      unit_count: formData.unit_count ? Number(formData.unit_count) : undefined,
      property_type: formData.property_type || undefined,
      authorized_services: formData.authorized_services,
      instructions: {
        package_location: formData.instructions.package_location || undefined,
        access_code: formData.instructions.access_code || undefined,
        access_notes: formData.instructions.access_notes || undefined,
        special_instructions: formData.instructions.special_instructions || undefined
      }
    };

    onSave(propertyData);
    resetForm();
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      authorized_services: prev.authorized_services.includes(service)
        ? prev.authorized_services.filter(s => s !== service)
        : [...prev.authorized_services, service]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Property Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="unitCount" className="block text-sm font-medium text-gray-700">
                  Number of Units
                </label>
                <input
                  type="number"
                  id="unitCount"
                  value={formData.unit_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit_count: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  id="propertyType"
                  value={formData.property_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Authorized Delivery Services
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {DELIVERY_SERVICES.map(service => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      formData.authorized_services.includes(service)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Delivery Instructions</h3>
              
              <div>
                <label htmlFor="packageLocation" className="block text-sm font-medium text-gray-700">
                  Package Location
                </label>
                <input
                  type="text"
                  id="packageLocation"
                  value={formData.instructions.package_location}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    instructions: { ...prev.instructions, package_location: e.target.value } }
                  ))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Front porch, Mailroom, etc."
                />
              </div>

              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                  Access Code
                </label>
                <input
                  type="text"
                  id="accessCode"
                  value={formData.instructions.access_code}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    instructions: { ...prev.instructions, access_code: e.target.value } }
                  ))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Gate code, Door code, etc."
                />
              </div>

              <div>
                <label htmlFor="accessNotes" className="block text-sm font-medium text-gray-700">
                  Access Notes
                </label>
                <textarea
                  id="accessNotes"
                  value={formData.instructions.access_notes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    instructions: { ...prev.instructions, access_notes: e.target.value } }
                  ))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Additional access information"
                />
              </div>

              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  id="specialInstructions"
                  value={formData.instructions.special_instructions}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    instructions: { ...prev.instructions, special_instructions: e.target.value } }
                  ))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Any special delivery instructions"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {property ? 'Save Changes' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 