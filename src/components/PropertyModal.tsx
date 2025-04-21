import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Property, PropertyInstructions } from '../types';

const DELIVERY_SERVICES = ['DHL', 'UPS', 'USPS', 'FedEx', 'Amazon'];

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'landlord_id'>) => void;
  property?: Property;
}

export default function PropertyModal({ isOpen, onClose, onSave, property }: PropertyModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [unitCount, setUnitCount] = useState<number | undefined>();
  const [propertyType, setPropertyType] = useState('');
  const [authorizedServices, setAuthorizedServices] = useState<string[]>([]);
  const [packageLocation, setPackageLocation] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [accessNotes, setAccessNotes] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (property) {
      setName(property.name);
      setAddress(property.address);
      setUnitCount(property.unit_count);
      setPropertyType(property.property_type || '');
      setAuthorizedServices(property.authorized_services || []);
      if (property.instructions) {
        setPackageLocation(property.instructions.package_location || '');
        setAccessCode(property.instructions.access_code || '');
        setAccessNotes(property.instructions.access_notes || '');
        setSpecialInstructions(property.instructions.special_instructions || '');
      }
    } else {
      resetForm();
    }
  }, [property]);

  const resetForm = () => {
    setName('');
    setAddress('');
    setUnitCount(undefined);
    setPropertyType('');
    setAuthorizedServices([]);
    setPackageLocation('');
    setAccessCode('');
    setAccessNotes('');
    setSpecialInstructions('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'landlord_id'> = {
      name,
      address,
      unit_count: unitCount,
      property_type: propertyType || undefined,
      authorized_services: authorizedServices,
      instructions: {
        package_location: packageLocation || undefined,
        access_code: accessCode || undefined,
        access_notes: accessNotes || undefined,
        special_instructions: specialInstructions || undefined
      }
    };

    onSave(propertyData);
    resetForm();
  };

  const toggleService = (service: string) => {
    setAuthorizedServices(prev => prev.includes(service)
      ? prev.filter(s => s !== service)
      : [...prev, service]);
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  value={unitCount || ''}
                  onChange={(e) => setUnitCount(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  id="propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Authorized Delivery Services
              </label>
              <div className="mt-2 space-y-2">
                {DELIVERY_SERVICES.map((service) => (
                  <label key={service} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={authorizedServices.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          toggleService(service);
                        } else {
                          toggleService(service);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">{service}</span>
                  </label>
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
                  value={packageLocation}
                  onChange={(e) => setPackageLocation(e.target.value)}
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
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
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
                  value={accessNotes}
                  onChange={(e) => setAccessNotes(e.target.value)}
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
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
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