PRAGMA foreign_keys = ON;

    create table if not exists leagues (
      id text primary key,
      name text not null unique,
      deletedAt text DEFAULT null,
      createdAt text DEFAULT CURRENT_TIMESTAMP
      );

    create table if not exists editions (
      id text primary key,
      leagueId text,
      name text not null unique,
      deletedAt text DEFAULT null,
      createdAt text DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leagueId) REFERENCES leagues(id) on delete cascade
      );
