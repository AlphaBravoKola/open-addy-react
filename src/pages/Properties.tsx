import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Property, PropertyInstructions } from '../types';
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
      // Get the user's landlord ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get properties with their instructions
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_instructions (
            id,
            package_location,
            access_code,
            access_notes,
            special_instructions
          )
        `)
        .eq('landlord_id', user.id);

      if (error) throw error;
      
      // Format the data
      const formattedData = (data || []).map(property => ({
        id: property.id,
        landlord_id: property.landlord_id,
        name: property.name || '',
        address: property.address || '',
        unit_count: property.unit_count,
        property_type: property.property_type,
        authorized_services: Array.isArray(property.authorized_services) ? property.authorized_services : [],
        instructions: property.property_instructions?.[0] || null,
        created_at: property.created_at,
        updated_at: property.updated_at
      }));

      setProperties(formattedData);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      // First delete the instructions
      const { error: instructionsError } = await supabase
        .from('property_instructions')
        .delete()
        .eq('property_id', id);

      if (instructionsError) throw instructionsError;

      // Then delete the property
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

  const handleSave = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'landlord_id'>) => {
    try {
      // Get the user's landlord ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the landlord record
      let landlordData: { id: string } | null = null;
      const { data: existingLandlord, error: landlordError } = await supabase
        .from('landlords')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (landlordError) throw landlordError;
      
      if (!existingLandlord) {
        // Create a new landlord record if one doesn't exist
        const { data: newLandlord, error: createError } = await supabase
          .from('landlords')
          .insert([{ 
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) throw createError;
        if (!newLandlord) throw new Error('Failed to create landlord record');
        
        landlordData = newLandlord;
      } else {
        landlordData = existingLandlord;
      }

      if (!landlordData) throw new Error('Failed to get or create landlord record');

      const { instructions, ...propertyFields } = propertyData;
      
      if (selectedProperty) {
        // Update existing property
        const { error: propertyError } = await supabase
          .from('properties')
          .update({
            name: propertyFields.name,
            address: propertyFields.address,
            unit_count: propertyFields.unit_count,
            property_type: propertyFields.property_type,
            authorized_services: propertyFields.authorized_services
          })
          .eq('id', selectedProperty.id);

        if (propertyError) throw propertyError;

        // Update or create instructions
        if (instructions) {
          if (selectedProperty.instructions?.id) {
            // Update existing instructions
            const { error: instructionsError } = await supabase
              .from('property_instructions')
              .update({
                package_location: instructions.package_location,
                access_code: instructions.access_code,
                access_notes: instructions.access_notes,
                special_instructions: instructions.special_instructions
              })
              .eq('id', selectedProperty.instructions.id);

            if (instructionsError) throw instructionsError;
          } else {
            // Create new instructions
            const { error: instructionsError } = await supabase
              .from('property_instructions')
              .insert([{
                property_id: selectedProperty.id,
                package_location: instructions.package_location,
                access_code: instructions.access_code,
                access_notes: instructions.access_notes,
                special_instructions: instructions.special_instructions
              }]);

            if (instructionsError) throw instructionsError;
          }
        }

        // Refresh the properties list
        fetchProperties();
      } else {
        // Create new property
        const { data: newProperty, error: propertyError } = await supabase
          .from('properties')
          .insert([{
            landlord_id: landlordData.id,
            name: propertyFields.name,
            address: propertyFields.address,
            unit_count: propertyFields.unit_count,
            property_type: propertyFields.property_type,
            authorized_services: propertyFields.authorized_services
          }])
          .select()
          .single();

        if (propertyError) throw propertyError;

        // Create instructions if provided
        if (instructions && newProperty) {
          const { error: instructionsError } = await supabase
            .from('property_instructions')
            .insert([{
              property_id: newProperty.id,
              package_location: instructions.package_location,
              access_code: instructions.access_code,
              access_notes: instructions.access_notes,
              special_instructions: instructions.special_instructions
            }]);

          if (instructionsError) throw instructionsError;
        }

        // Refresh the properties list
        fetchProperties();
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
                {property.unit_count && (
                  <p className="text-sm text-gray-500 mt-1">Units: {property.unit_count}</p>
                )}
                {property.property_type && (
                  <p className="text-sm text-gray-500">Type: {property.property_type}</p>
                )}
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
              {property.instructions && (
                <>
                  {property.instructions.package_location && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Package Location</h3>
                      <p className="mt-1 text-sm text-gray-600">{property.instructions.package_location}</p>
                    </div>
                  )}

                  {property.instructions.special_instructions && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Special Instructions</h3>
                      <p className="mt-1 text-sm text-gray-600">{property.instructions.special_instructions}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Access Information</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {property.instructions.access_code && (
                        <span className="block">Code: {property.instructions.access_code}</span>
                      )}
                      {property.instructions.access_notes && (
                        <span className="block mt-1">{property.instructions.access_notes}</span>
                      )}
                      {!property.instructions.access_code && !property.instructions.access_notes && (
                        <span className="text-gray-500">No access information provided</span>
                      )}
                    </p>
                  </div>
                </>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-900">Authorized Delivery Services</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(property.authorized_services || []).map((service, index) => (
                    <span
                      key={`${service}-${index}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {service}
                    </span>
                  ))}
                  {(!property.authorized_services || property.authorized_services.length === 0) && (
                    <span className="text-sm text-gray-500">No authorized services</span>
                  )}
                </div>
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