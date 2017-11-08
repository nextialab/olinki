create table repos(
    id int auto_increment primary key, 
    name text, 
    local_uri text,
    status text,
    docker_id text
);