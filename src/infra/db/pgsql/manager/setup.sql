create table if not exists db_migration (
    id bigserial not null primary key,
    version varchar(255) not null,
    status varchar(20) not null,
    constraint db_migration_version_ukey unique(version)
);
