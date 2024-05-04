#!/bin/bash

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$POSTGRES_DB"  <<-EOSQL
    INSERT INTO "user"
    (name, email, password)
    VALUES
    ('leo', 'leo@example.com', '$2y$10$igJQ7iPv/dZIr9GhlxSUBOIi.GSO8jWiRtM5qIs6SjME/hgczXQOy');
EOSQL
