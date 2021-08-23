# Datamodel for a geotagged photo

geotagged_photo:
- id - uuid, primary key, unique, default: gen_random_uuid()
- request_task_id - uuid
- created - timestamp with time zone, default: now()
- comment - text, nullable
- user_id - uuid
- parcel_id - uuid
- exif - jsonb, nullable
- uri - text, nullable
- token - text, nullable
- location - geography