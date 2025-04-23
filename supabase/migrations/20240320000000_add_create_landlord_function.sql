-- Create the function to handle landlord creation
create or replace function create_landlord_for_user()
returns json
language plpgsql
security definer
as $$
declare
  new_landlord json;
begin
  -- Insert the new landlord record using the authenticated user's ID
  insert into landlords (id, created_at)
  values (auth.uid(), now())
  returning json_build_object(
    'id', id,
    'created_at', created_at
  ) into new_landlord;
  
  return new_landlord;
end;
$$; 