-- handle_new_user
begin
  insert into public.profiles (email)
  values (new.email);
  return new;
end;