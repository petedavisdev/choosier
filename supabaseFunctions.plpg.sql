-- handle_new_user
begin
  insert into public.profiles (user_id, email, credits_added)
  values (new.id, new.email, 10);
  return new;
end;
