CREATE TABLE IF NOT EXISTS "user" (
     id uuid DEFAULT gen_random_uuid(),
     name varchar(100) NOT NULL,
     email varchar(191) NOT NULL,
     password varchar(255) NOT NULL,
     created_at timestamp NOT NULL DEFAULT NOW(),
     updated_at timestamp NOT NULL DEFAULT NOW(),
     PRIMARY KEY(id),
     UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS login_history (
     id uuid DEFAULT gen_random_uuid(),
     user_id uuid NOT NULL,
     last_login_at timestamp NOT NULL DEFAULT NOW(),
     PRIMARY KEY(id)
);
