
    create table if not exist leagues (
      id INTEGER primary key,
      name text not null,
      createdAt text DEFAULT CURRENT_TIMESTAMP,
      );

    insert into leagues (name) values('ipl')