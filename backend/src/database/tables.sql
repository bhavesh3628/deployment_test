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

    create table if not exists PlayerApplications (
      auctionId text not null,
      id text primary key,
      playerId text not null,
      submittedAt text DEFAULT CURRENT_TIMESTAMP,
      deletedAt text DEFAULT null,
      roundBasePrice text not null,
      status text CHECK( status IN ('pending','accepted','rejected'))not null DEFAULT 'pending'
    );
