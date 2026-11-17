/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AllAboutBand = {
  __typename?: 'AllAboutBand';
  active_years: Array<Scalars['Int']['output']>;
  albums: Array<BandAlbum>;
  database?: Maybe<SqlBand>;
  elasticsearch?: Maybe<Band>;
  genres: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inserted_at?: Maybe<Scalars['String']['output']>;
  members: Array<BandMember>;
  name: Scalars['String']['output'];
  songs_hits: Array<BandSongHit>;
};

export type AllAboutBandSummary = {
  __typename?: 'AllAboutBandSummary';
  active_years: Array<Scalars['Int']['output']>;
  albums: Array<BandAlbum>;
  database?: Maybe<SqlBandSummary>;
  elasticsearch?: Maybe<Band>;
  genres: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inserted_at?: Maybe<Scalars['String']['output']>;
  members: Array<BandMember>;
  name: Scalars['String']['output'];
  songs_hits: Array<BandSongHit>;
};

export type Band = {
  __typename?: 'Band';
  active_years: Array<Scalars['Int']['output']>;
  albums: Array<BandAlbum>;
  genres: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inserted_at?: Maybe<Scalars['String']['output']>;
  members: Array<BandMember>;
  name: Scalars['String']['output'];
  songs_hits: Array<BandSongHit>;
};

export type BandAlbum = {
  __typename?: 'BandAlbum';
  id: Scalars['String']['output'];
  length_minutes?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};

export type BandMember = {
  __typename?: 'BandMember';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type BandSongHit = {
  __typename?: 'BandSongHit';
  achievement?: Maybe<Scalars['String']['output']>;
  discography?: Maybe<SongDiscography>;
  title: Scalars['String']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAllAboutBand?: Maybe<AllAboutBandSummary>;
  getAllAboutBandDebug?: Maybe<AllAboutBand>;
  getBand?: Maybe<Band>;
  searchBands: Array<Band>;
};


export type QueryGetAllAboutBandArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAllAboutBandDebugArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetBandArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchBandsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type SqlAlbum = {
  __typename?: 'SQLAlbum';
  BandId: Scalars['Int']['output'];
  Id: Scalars['Int']['output'];
  albumArtists: Array<SqlAlbumArtist>;
  albumSongs: Array<SqlAlbumSong>;
  lengthMinutes: Scalars['String']['output'];
  title: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type SqlAlbumArtist = {
  __typename?: 'SQLAlbumArtist';
  albumId: Scalars['Int']['output'];
  artist: SqlArtist;
  artistId: Scalars['Int']['output'];
};

export type SqlAlbumArtistSummary = {
  __typename?: 'SQLAlbumArtistSummary';
  artist: SqlArtistSummary;
};

export type SqlAlbumSong = {
  __typename?: 'SQLAlbumSong';
  albumId: Scalars['Int']['output'];
  song: SqlSong;
  songId: Scalars['Int']['output'];
  trackNumber: Scalars['Int']['output'];
};

export type SqlAlbumSummary = {
  __typename?: 'SQLAlbumSummary';
  albumArtists: Array<SqlAlbumArtistSummary>;
  albumSongs: Array<SqlAlbumSong>;
  lengthMinutes: Scalars['String']['output'];
  title: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type SqlArtist = {
  __typename?: 'SQLArtist';
  BandId: Scalars['Int']['output'];
  Id: Scalars['Int']['output'];
  artistInstruments: Array<SqlArtistInstrument>;
  birthdate: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SqlArtistInstrument = {
  __typename?: 'SQLArtistInstrument';
  artistId: Scalars['Int']['output'];
  instrument: SqlInstrument;
  instrumentId: Scalars['Int']['output'];
};

export type SqlArtistInstrumentSummary = {
  __typename?: 'SQLArtistInstrumentSummary';
  instrument: SqlInstrumentSummary;
};

export type SqlArtistSummary = {
  __typename?: 'SQLArtistSummary';
  artistInstruments: Array<SqlArtistInstrumentSummary>;
  birthdate: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SqlBand = {
  __typename?: 'SQLBand';
  Id: Scalars['Int']['output'];
  albums: Array<SqlAlbum>;
  artists: Array<SqlArtist>;
  es_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  officialWebsite: Scalars['String']['output'];
  origin: Scalars['String']['output'];
  rockAndRollHallOfFameInduction?: Maybe<Scalars['Int']['output']>;
};

export type SqlBandSummary = {
  __typename?: 'SQLBandSummary';
  Id: Scalars['Int']['output'];
  albums: Array<SqlAlbumSummary>;
  artists: Array<SqlArtistSummary>;
  es_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  officialWebsite: Scalars['String']['output'];
  origin: Scalars['String']['output'];
  rockAndRollHallOfFameInduction?: Maybe<Scalars['Int']['output']>;
};

export type SqlInstrument = {
  __typename?: 'SQLInstrument';
  Id: Scalars['Int']['output'];
  Type: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SqlInstrumentSummary = {
  __typename?: 'SQLInstrumentSummary';
  Type: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SqlSong = {
  __typename?: 'SQLSong';
  Id: Scalars['Int']['output'];
  achievement: Scalars['String']['output'];
  hit: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type SongDiscography = {
  __typename?: 'SongDiscography';
  studio_albums: Array<StudioAlbum>;
};

export type StudioAlbum = {
  __typename?: 'StudioAlbum';
  id: Scalars['String']['output'];
  length_minutes?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};
