create type "auth"."one_time_token_type" as enum ('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');

alter type "auth"."factor_type" rename to "factor_type__old_version_to_be_dropped";

create type "auth"."factor_type" as enum ('totp', 'webauthn', 'phone');

create table "auth"."one_time_tokens" (
    "id" uuid not null,
    "user_id" uuid not null,
    "token_type" auth.one_time_token_type not null,
    "token_hash" text not null,
    "relates_to" text not null,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


alter table "auth"."one_time_tokens" enable row level security;

alter table "auth"."mfa_factors" alter column factor_type type "auth"."factor_type" using factor_type::text::"auth"."factor_type";

drop type "auth"."factor_type__old_version_to_be_dropped";

alter table "auth"."audit_log_entries" enable row level security;

alter table "auth"."flow_state" add column "auth_code_issued_at" timestamp with time zone;

alter table "auth"."flow_state" enable row level security;

alter table "auth"."identities" enable row level security;

alter table "auth"."instances" enable row level security;

alter table "auth"."mfa_amr_claims" enable row level security;

alter table "auth"."mfa_challenges" add column "otp_code" text;

alter table "auth"."mfa_challenges" add column "web_authn_session_data" jsonb;

alter table "auth"."mfa_challenges" enable row level security;

alter table "auth"."mfa_factors" add column "last_challenged_at" timestamp with time zone;

alter table "auth"."mfa_factors" add column "phone" text;

alter table "auth"."mfa_factors" add column "web_authn_aaguid" uuid;

alter table "auth"."mfa_factors" add column "web_authn_credential" jsonb;

alter table "auth"."mfa_factors" enable row level security;

alter table "auth"."refresh_tokens" enable row level security;

alter table "auth"."saml_providers" add column "name_id_format" text;

alter table "auth"."saml_providers" enable row level security;

alter table "auth"."saml_relay_states" drop column "from_ip_address";

alter table "auth"."saml_relay_states" enable row level security;

alter table "auth"."schema_migrations" enable row level security;

alter table "auth"."sessions" enable row level security;

alter table "auth"."sso_domains" enable row level security;

alter table "auth"."sso_providers" enable row level security;

alter table "auth"."users" add column "is_anonymous" boolean not null default false;

alter table "auth"."users" enable row level security;

CREATE UNIQUE INDEX mfa_factors_last_challenged_at_key ON auth.mfa_factors USING btree (last_challenged_at);

CREATE UNIQUE INDEX one_time_tokens_pkey ON auth.one_time_tokens USING btree (id);

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);

CREATE INDEX refresh_token_session_id ON auth.refresh_tokens USING btree (session_id);

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);

CREATE UNIQUE INDEX users_email_key ON auth.users USING btree (email);

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);

alter table "auth"."one_time_tokens" add constraint "one_time_tokens_pkey" PRIMARY KEY using index "one_time_tokens_pkey";

alter table "auth"."mfa_factors" add constraint "mfa_factors_last_challenged_at_key" UNIQUE using index "mfa_factors_last_challenged_at_key";

alter table "auth"."one_time_tokens" add constraint "one_time_tokens_token_hash_check" CHECK ((char_length(token_hash) > 0)) not valid;

alter table "auth"."one_time_tokens" validate constraint "one_time_tokens_token_hash_check";

alter table "auth"."one_time_tokens" add constraint "one_time_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "auth"."one_time_tokens" validate constraint "one_time_tokens_user_id_fkey";

alter table "auth"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION auth.email()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.email', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
	)::text
$function$
;

CREATE OR REPLACE FUNCTION auth.role()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.role', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
	)::text
$function$
;

CREATE OR REPLACE FUNCTION auth.uid()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.sub', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
	)::uuid
$function$
;

grant delete on table "auth"."one_time_tokens" to "dashboard_user";

grant insert on table "auth"."one_time_tokens" to "dashboard_user";

grant references on table "auth"."one_time_tokens" to "dashboard_user";

grant select on table "auth"."one_time_tokens" to "dashboard_user";

grant trigger on table "auth"."one_time_tokens" to "dashboard_user";

grant truncate on table "auth"."one_time_tokens" to "dashboard_user";

grant update on table "auth"."one_time_tokens" to "dashboard_user";

grant delete on table "auth"."one_time_tokens" to "postgres";

grant insert on table "auth"."one_time_tokens" to "postgres";

grant references on table "auth"."one_time_tokens" to "postgres";

grant select on table "auth"."one_time_tokens" to "postgres";

grant trigger on table "auth"."one_time_tokens" to "postgres";

grant truncate on table "auth"."one_time_tokens" to "postgres";

grant update on table "auth"."one_time_tokens" to "postgres";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION storage.get_level(name text)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
SELECT array_length(string_to_array("name", '/'), 1);
$function$
;

create table "storage"."prefixes" (
    "bucket_id" text not null,
    "name" text not null,
    "level" integer not null generated always as (storage.get_level(name)) stored,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "storage"."prefixes" enable row level security;

create table "storage"."s3_multipart_uploads" (
    "id" text not null,
    "in_progress_size" bigint not null default 0,
    "upload_signature" text not null,
    "bucket_id" text not null,
    "key" text not null,
    "version" text not null,
    "owner_id" text,
    "created_at" timestamp with time zone not null default now(),
    "user_metadata" jsonb
);


alter table "storage"."s3_multipart_uploads" enable row level security;

create table "storage"."s3_multipart_uploads_parts" (
    "id" uuid not null default gen_random_uuid(),
    "upload_id" text not null,
    "size" bigint not null default 0,
    "part_number" integer not null,
    "bucket_id" text not null,
    "key" text not null,
    "etag" text not null,
    "owner_id" text,
    "version" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "storage"."s3_multipart_uploads_parts" enable row level security;

alter table "storage"."objects" add column "level" integer;

alter table "storage"."objects" add column "user_metadata" jsonb;

alter table "storage"."objects" alter column "id" set default gen_random_uuid();

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);

CREATE UNIQUE INDEX idx_name_bucket_unique ON storage.objects USING btree (name COLLATE "C", bucket_id);

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");

CREATE UNIQUE INDEX prefixes_pkey ON storage.prefixes USING btree (bucket_id, level, name);

CREATE UNIQUE INDEX s3_multipart_uploads_parts_pkey ON storage.s3_multipart_uploads_parts USING btree (id);

CREATE UNIQUE INDEX s3_multipart_uploads_pkey ON storage.s3_multipart_uploads USING btree (id);

alter table "storage"."prefixes" add constraint "prefixes_pkey" PRIMARY KEY using index "prefixes_pkey";

alter table "storage"."s3_multipart_uploads" add constraint "s3_multipart_uploads_pkey" PRIMARY KEY using index "s3_multipart_uploads_pkey";

alter table "storage"."s3_multipart_uploads_parts" add constraint "s3_multipart_uploads_parts_pkey" PRIMARY KEY using index "s3_multipart_uploads_parts_pkey";

alter table "storage"."prefixes" add constraint "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id) not valid;

alter table "storage"."prefixes" validate constraint "prefixes_bucketId_fkey";

alter table "storage"."s3_multipart_uploads" add constraint "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id) not valid;

alter table "storage"."s3_multipart_uploads" validate constraint "s3_multipart_uploads_bucket_id_fkey";

alter table "storage"."s3_multipart_uploads_parts" add constraint "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id) not valid;

alter table "storage"."s3_multipart_uploads_parts" validate constraint "s3_multipart_uploads_parts_bucket_id_fkey";

alter table "storage"."s3_multipart_uploads_parts" add constraint "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE not valid;

alter table "storage"."s3_multipart_uploads_parts" validate constraint "s3_multipart_uploads_parts_upload_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.add_prefixes(_bucket_id text, _name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.delete_prefix(_bucket_id text, _name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.delete_prefix_hierarchy_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.enforce_bucket_name_length()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION storage.get_prefix(name text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$function$
;

CREATE OR REPLACE FUNCTION storage.get_prefixes(name text)
 RETURNS text[]
 LANGUAGE plpgsql
 IMMUTABLE STRICT
AS $function$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text)
 RETURNS TABLE(key text, id text, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text)
 RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.objects_insert_prefix_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.objects_update_prefix_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.operation()
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.prefixes_insert_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)
 RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$function$
;

CREATE OR REPLACE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)
 RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$function$
;

CREATE OR REPLACE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text)
 RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.get_size_by_bucket()
 RETURNS TABLE(size bigint, bucket_id text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$function$
;

CREATE OR REPLACE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)
 RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
AS $function$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$function$
;

grant delete on table "storage"."prefixes" to "anon";

grant insert on table "storage"."prefixes" to "anon";

grant references on table "storage"."prefixes" to "anon";

grant select on table "storage"."prefixes" to "anon";

grant trigger on table "storage"."prefixes" to "anon";

grant truncate on table "storage"."prefixes" to "anon";

grant update on table "storage"."prefixes" to "anon";

grant delete on table "storage"."prefixes" to "authenticated";

grant insert on table "storage"."prefixes" to "authenticated";

grant references on table "storage"."prefixes" to "authenticated";

grant select on table "storage"."prefixes" to "authenticated";

grant trigger on table "storage"."prefixes" to "authenticated";

grant truncate on table "storage"."prefixes" to "authenticated";

grant update on table "storage"."prefixes" to "authenticated";

grant delete on table "storage"."prefixes" to "service_role";

grant insert on table "storage"."prefixes" to "service_role";

grant references on table "storage"."prefixes" to "service_role";

grant select on table "storage"."prefixes" to "service_role";

grant trigger on table "storage"."prefixes" to "service_role";

grant truncate on table "storage"."prefixes" to "service_role";

grant update on table "storage"."prefixes" to "service_role";

grant select on table "storage"."s3_multipart_uploads" to "anon";

grant select on table "storage"."s3_multipart_uploads" to "authenticated";

grant delete on table "storage"."s3_multipart_uploads" to "service_role";

grant insert on table "storage"."s3_multipart_uploads" to "service_role";

grant references on table "storage"."s3_multipart_uploads" to "service_role";

grant select on table "storage"."s3_multipart_uploads" to "service_role";

grant trigger on table "storage"."s3_multipart_uploads" to "service_role";

grant truncate on table "storage"."s3_multipart_uploads" to "service_role";

grant update on table "storage"."s3_multipart_uploads" to "service_role";

grant select on table "storage"."s3_multipart_uploads_parts" to "anon";

grant select on table "storage"."s3_multipart_uploads_parts" to "authenticated";

grant delete on table "storage"."s3_multipart_uploads_parts" to "service_role";

grant insert on table "storage"."s3_multipart_uploads_parts" to "service_role";

grant references on table "storage"."s3_multipart_uploads_parts" to "service_role";

grant select on table "storage"."s3_multipart_uploads_parts" to "service_role";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "service_role";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "service_role";

grant update on table "storage"."s3_multipart_uploads_parts" to "service_role";

create policy "Authenticate users can update an avatar"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'avatars'::text));


create policy "Authenticated users can upload an avatar."
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'avatars'::text));


create policy "Authenticated users can upload cover 1cmn924_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'covers'::text));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));


create policy "Covers are publicly accessible 1cmn924_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'covers'::text));


CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


