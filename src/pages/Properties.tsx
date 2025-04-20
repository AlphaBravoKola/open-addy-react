import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Property } from '../types';
import { supabase } from '../utils/supabaseClient';
import PropertyModal from '../components/PropertyModal';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure data matches the Property interface
      const formattedData = (data || []).map(property => ({
        id: property.id,
        name: property.name || '',
        address: property.address || '',
        deliveryInstructions: property.delivery_instructions || '',
        propertyUpdates: property.property_updates || '',
        authorizedServices: Array.isArray(property.authorized_services) ? property.authorized_services : [],
        accessInformation: {
          code: property.access_code || '',
          additionalInfo: property.access_info || ''
        },
        created_at: property.created_at,
        updated_at: property.updated_at
      }));
      
      setProperties(formattedData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProperties(properties.filter(prop => prop.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProperty(undefined);
    setIsModalOpen(true);
  };

  const handleSave = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Convert the data to match the database schema
      const dbData = {
        name: propertyData.name,
        address: propertyData.address,
        delivery_instructions: propertyData.deliveryInstructions,
        property_updates: propertyData.propertyUpdates,
        authorized_services: propertyData.authorizedServices,
        access_code: propertyData.accessInformation.code,
        access_info: propertyData.accessInformation.additionalInfo
      };

      if (selectedProperty) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(dbData)
          .eq('id', selectedProperty.id);

        if (error) throw error;

        setProperties(properties.map(p => 
          p.id === selectedProperty.id 
            ? { 
                ...propertyData, 
                id: p.id, 
                created_at: p.created_at, 
                updated_at: new Date().toISOString()
              }
            : p
        ));
      } else {
        // Create new property
        const { data, error } = await supabase
          .from('properties')
          .insert([dbData])
          .select();

        if (error) throw error;
        if (data) {
          const newProperty: Property = {
            id: data[0].id,
            name: data[0].name || '',
            address: data[0].address || '',
            deliveryInstructions: data[0].delivery_instructions || '',
            propertyUpdates: data[0].property_updates || '',
            authorizedServices: Array.isArray(data[0].authorized_services) ? data[0].authorized_services : [],
            accessInformation: {
              code: data[0].access_code || '',
              additionalInfo: data[0].access_info || ''
            },
            created_at: data[0].created_at,
            updated_at: data[0].updated_at
          };
          setProperties([newProperty, ...properties]);
        }
      }

      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.message);
      console.error('Error saving property:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Properties</h1>
        <button 
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-medium text-gray-900">{property.name}</h2>
                <p className="text-gray-500">{property.address}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => handleEdit(property)}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleDelete(property.id)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Delivery Instructions</h3>
                <p className="mt-1 text-sm text-gray-600">{property.deliveryInstructions || 'No delivery instructions provided'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Property Updates</h3>
                <p className="mt-1 text-sm text-gray-600">{property.propertyUpdates || 'No property updates'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Authorized Delivery Services</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(property.authorizedServices || []).map((service, index) => (
                    <span
                      key={`${service}-${index}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {service}
                    </span>
                  ))}
                  {(!property.authorizedServices || property.authorizedServices.length === 0) && (
                    <span className="text-sm text-gray-500">No authorized services</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Access Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Code: {property.accessInformation.code || 'No code provided'}
                  {property.accessInformation.additionalInfo && (
                    <span className="block mt-1">{property.accessInformation.additionalInfo}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties added yet.</p>
          </div>
        )}
      </div>

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        property={selectedProperty}
      />
    </div>
  );
} 