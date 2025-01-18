-- handle_new_user
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
