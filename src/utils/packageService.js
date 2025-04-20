import { supabase } from './supabaseClient';

export const packageService = {
  async getPackages() {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPackageById(id) {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createPackage(packageData) {
    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updatePackage(id, updates) {
    const { data, error } = await supabase
      .from('packages')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deletePackage(id) {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}; 