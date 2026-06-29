create table provinces (
    id serial primary key,
    name_en text not null,
    name_np text not null,
    province_code integer not null
);

create table districts (
    id serial primary key,
    name_en text not null,
    name_np text not null,
    province_code integer not null,
    -- province_id integer references provinces(id)
);