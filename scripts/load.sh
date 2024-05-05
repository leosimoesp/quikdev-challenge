#!/bin/bash

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$POSTGRES_DB"  <<-EOSQL
    INSERT INTO "user"
    (name, email, password)
    VALUES
    ('Leo', 'leo@example.com', E'\$2b\$10\$sejJpk/.a7FGNSPGZBX5O.cK5WnGT6B3LUcIw43ywTmv/OFXptURS');

    INSERT INTO "user"
    (name, email, password)
    VALUES
    ('Teste', 'teste@example.com', E'\$2b\$10\$sejJpk/.a7FGNSPGZBX5O.cK5WnGT6B3LUcIw43ywTmv/OFXptURS');
                                 
EOSQL


                       