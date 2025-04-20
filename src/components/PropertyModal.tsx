import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Property } from '../types';

const DELIVERY_SERVICES = ['DHL', 'UPS', 'USPS', 'FedEx', 'Amazon'];

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => void;
  property?: Property;
}

export default function PropertyModal({ isOpen, onClose, onSave, property }: PropertyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    deliveryInstructions: '',
    propertyUpdates: '',
    accessInformation: {
      code: '',
      additionalInfo: ''
    },
    authorizedServices: [] as string[]
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        address: property.address,
        deliveryInstructions: property.deliveryInstructions,
        propertyUpdates: property.propertyUpdates,
        accessInformation: {
          code: property.accessInformation.code,
          additionalInfo: property.accessInformation.additionalInfo || ''
        },
        authorizedServices: property.authorizedServices
      });
    } else {
      setFormData({
        name: '',
        address: '',
        deliveryInstructions: '',
        propertyUpdates: '',
        accessInformation: {
          code: '',
          additionalInfo: ''
        },
        authorizedServices: []
      });
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      authorizedServices: prev.authorizedServices.includes(service)
        ? prev.authorizedServices.filter(s => s !== service)
        : [...prev.authorizedServices, service]
    }));
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Property Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.address}
                      onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700">
                      Delivery Instructions
                    </label>
                    <textarea
                      id="deliveryInstructions"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.deliveryInstructions}
                      onChange={e => setFormData(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="propertyUpdates" className="block text-sm font-medium text-gray-700">
                      Property Updates
                    </label>
                    <textarea
                      id="propertyUpdates"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.propertyUpdates}
                      onChange={e => setFormData(prev => ({ ...prev, propertyUpdates: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Authorized Delivery Services
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {DELIVERY_SERVICES.map(service => (
                        <button
                          key={service}
                          type="button"
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            formData.authorizedServices.includes(service)
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          onClick={() => toggleService(service)}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                      Access Code
                    </label>
                    <input
                      type="text"
                      id="accessCode"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.accessInformation.code}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        accessInformation: { ...prev.accessInformation, code: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                      Additional Access Information
                    </label>
                    <textarea
                      id="additionalInfo"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.accessInformation.additionalInfo}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        accessInformation: { ...prev.accessInformation, additionalInfo: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                    >
                      {property ? 'Update Property' : 'Add Property'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 