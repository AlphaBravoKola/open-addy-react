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
      
      // Ensure authorizedServices is always an array
      const formattedData = (data || []).map(property => ({
        ...property,
        authorizedServices: property.authorizedServices || [],
        accessInformation: {
          code: property.accessInformation?.code || '',
          additionalInfo: property.accessInformation?.additionalInfo || ''
        }
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
      if (selectedProperty) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update({
            ...propertyData,
            authorizedServices: propertyData.authorizedServices || [],
            accessInformation: {
              code: propertyData.accessInformation?.code || '',
              additionalInfo: propertyData.accessInformation?.additionalInfo || ''
            }
          })
          .eq('id', selectedProperty.id);

        if (error) throw error;

        setProperties(properties.map(p => 
          p.id === selectedProperty.id 
            ? { 
                ...propertyData, 
                id: p.id, 
                created_at: p.created_at, 
                updated_at: new Date().toISOString(),
                authorizedServices: propertyData.authorizedServices || [],
                accessInformation: {
                  code: propertyData.accessInformation?.code || '',
                  additionalInfo: propertyData.accessInformation?.additionalInfo || ''
                }
              }
            : p
        ));
      } else {
        // Create new property
        const { data, error } = await supabase
          .from('properties')
          .insert([{
            ...propertyData,
            authorizedServices: propertyData.authorizedServices || [],
            accessInformation: {
              code: propertyData.accessInformation?.code || '',
              additionalInfo: propertyData.accessInformation?.additionalInfo || ''
            }
          }])
          .select();

        if (error) throw error;
        if (data) {
          setProperties([data[0], ...properties]);
        }
      }

      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.message);
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
                <p className="mt-1 text-sm text-gray-600">{property.deliveryInstructions}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Property Updates</h3>
                <p className="mt-1 text-sm text-gray-600">{property.propertyUpdates}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Authorized Delivery Services</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(property.authorizedServices || []).map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Access Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Code: {property.accessInformation?.code || ''}
                  {property.accessInformation?.additionalInfo && (
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