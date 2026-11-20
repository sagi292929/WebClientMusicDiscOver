/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type AlbumMatch = {
  __typename?: 'AlbumMatch';
  Id: Scalars['Int']['output'];
  bandName: Scalars['String']['output'];
  lengthMinutes: Scalars['String']['output'];
  title: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type AllAboutArtist = {
  __typename?: 'AllAboutArtist';
  born_in?: Maybe<Scalars['String']['output']>;
  database?: Maybe<ArtistDatabaseDetails>;
  elasticsearch: Artist;
  es_id: Scalars['String']['output'];
  former_bands: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
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

export type Artist = {
  __typename?: 'Artist';
  born_in?: Maybe<Scalars['String']['output']>;
  es_id: Scalars['String']['output'];
  former_bands: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ArtistAlbum = {
  __typename?: 'ArtistAlbum';
  Id: Scalars['Int']['output'];
  lengthMinutes: Scalars['String']['output'];
  songs: Array<ArtistSong>;
  title: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type ArtistAlbumAppearance = {
  __typename?: 'ArtistAlbumAppearance';
  album: ArtistAlbum;
  albumId: Scalars['Int']['output'];
};

export type ArtistBand = {
  __typename?: 'ArtistBand';
  Id: Scalars['Int']['output'];
  es_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  officialWebsite: Scalars['String']['output'];
  origin: Scalars['String']['output'];
  rockAndRollHallOfFameInduction?: Maybe<Scalars['Int']['output']>;
};

export type ArtistDatabaseDetails = {
  __typename?: 'ArtistDatabaseDetails';
  Id: Scalars['Int']['output'];
  albums: Array<ArtistAlbumAppearance>;
  band: ArtistBand;
  birthdate: Scalars['String']['output'];
  es_id: Scalars['String']['output'];
  instruments: Array<ArtistInstrument>;
  name: Scalars['String']['output'];
};

export type ArtistInstrument = {
  __typename?: 'ArtistInstrument';
  Type: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ArtistMatch = {
  __typename?: 'ArtistMatch';
  born_in?: Maybe<Scalars['String']['output']>;
  es_id: Scalars['String']['output'];
  former_bands: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ArtistSong = {
  __typename?: 'ArtistSong';
  achievement: Scalars['String']['output'];
  hit: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  year: Scalars['Int']['output'];
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

export type BandMatch = {
  __typename?: 'BandMatch';
  active_years: Array<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
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

export type MainGenreGroup = {
  __typename?: 'MainGenreGroup';
  genres: Array<SqlGenre>;
  main_genre?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAlbum: Array<AlbumMatch>;
  getAllAboutArtist: Array<AllAboutArtist>;
  getAllAboutBand?: Maybe<AllAboutBandSummary>;
  getArtist: Array<ArtistMatch>;
  getBand: Array<BandMatch>;
  getGenre: Array<MainGenreGroup>;
  getSong: Array<SongMatch>;
  searchBands: Array<Band>;
};


export type QueryGetAlbumArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetAllAboutArtistArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};


export type QueryGetAllAboutBandArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetArtistArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};


export type QueryGetBandArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetSongArgs = {
  name: Scalars['String']['input'];
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
  birthdate?: Maybe<Scalars['String']['output']>;
  es_id: Scalars['String']['output'];
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
  birthdate?: Maybe<Scalars['String']['output']>;
  es_id: Scalars['String']['output'];
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

export type SqlGenre = {
  __typename?: 'SQLGenre';
  Id: Scalars['Int']['output'];
  main_genre?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
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

export type SongMatch = {
  __typename?: 'SongMatch';
  band_name: Scalars['String']['output'];
  es_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type StudioAlbum = {
  __typename?: 'StudioAlbum';
  id: Scalars['String']['output'];
  length_minutes?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};

export type GetSongQueryVariables = Exact<{
  name: string;
}>;


export type GetSongQuery = { getSong: Array<{ es_id: string, name: string, band_name: string }> };

export type GetAlbumQueryVariables = Exact<{
  name: string;
}>;


export type GetAlbumQuery = { getAlbum: Array<{ Id: number, title: string, bandName: string, year: number, lengthMinutes: string }> };

export type GetBandQueryVariables = Exact<{
  name: string;
}>;


export type GetBandQuery = { getBand: Array<{ id: string, name: string, active_years: Array<number> }> };

export type GetAllAboutBandQueryVariables = Exact<{
  id: string;
}>;


export type GetAllAboutBandQuery = { getAllAboutBand: { id: string, name: string, active_years: Array<number>, genres: Array<string>, inserted_at: string | null, members: Array<{ id: string, name: string }>, albums: Array<{ id: string, name: string, year: number | null, length_minutes: string | null }>, songs_hits: Array<{ title: string, year: number | null, achievement: string | null, discography: { studio_albums: Array<{ id: string, name: string, year: number | null, length_minutes: string | null }> } | null }>, database: { Id: number, es_id: string, name: string, origin: string, officialWebsite: string, rockAndRollHallOfFameInduction: number | null, artists: Array<{ es_id: string, name: string, birthdate: string | null, artistInstruments: Array<{ instrument: { name: string, Type: string } }> }>, albums: Array<{ title: string, year: number, lengthMinutes: string, albumArtists: Array<{ artist: { es_id: string, name: string, birthdate: string | null, artistInstruments: Array<{ instrument: { name: string, Type: string } }> } }>, albumSongs: Array<{ albumId: number, songId: number, trackNumber: number, song: { Id: number, title: string, year: number, achievement: string, hit: boolean } }> }> } | null, elasticsearch: { id: string, name: string, active_years: Array<number>, genres: Array<string>, inserted_at: string | null, members: Array<{ id: string, name: string }>, albums: Array<{ id: string, name: string, year: number | null, length_minutes: string | null }>, songs_hits: Array<{ title: string, year: number | null, achievement: string | null, discography: { studio_albums: Array<{ id: string, name: string, year: number | null, length_minutes: string | null }> } | null }> } | null } | null };

export type GetGenreQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGenreQuery = { getGenre: Array<{ main_genre: string | null, genres: Array<{ Id: number, name: string }> }> };

export type GetArtistAndAboutQueryVariables = Exact<{
  name: string;
}>;


export type GetArtistAndAboutQuery = { getArtist: Array<{ es_id: string, name: string, born_in: string | null }>, getAllAboutArtist: Array<{ es_id: string, name: string, born_in: string | null, database: { birthdate: string, band: { name: string }, instruments: Array<{ name: string, Type: string }> } | null }> };


export const GetSongDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSong"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSong"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"es_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"band_name"}}]}}]}}]} as unknown as DocumentNode<GetSongQuery, GetSongQueryVariables>;
export const GetAlbumDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAlbum"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAlbum"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"bandName"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lengthMinutes"}}]}}]}}]} as unknown as DocumentNode<GetAlbumQuery, GetAlbumQueryVariables>;
export const GetBandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active_years"}}]}}]}}]} as unknown as DocumentNode<GetBandQuery, GetBandQueryVariables>;
export const GetAllAboutBandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllAboutBand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllAboutBand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active_years"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"inserted_at"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"albums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"length_minutes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"songs_hits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"achievement"}},{"kind":"Field","name":{"kind":"Name","value":"discography"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studio_albums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"length_minutes"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"database"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"es_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}},{"kind":"Field","name":{"kind":"Name","value":"officialWebsite"}},{"kind":"Field","name":{"kind":"Name","value":"rockAndRollHallOfFameInduction"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"es_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthdate"}},{"kind":"Field","name":{"kind":"Name","value":"artistInstruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instrument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"albums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lengthMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"albumArtists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"artist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"es_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthdate"}},{"kind":"Field","name":{"kind":"Name","value":"artistInstruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instrument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"albumSongs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"albumId"}},{"kind":"Field","name":{"kind":"Name","value":"songId"}},{"kind":"Field","name":{"kind":"Name","value":"trackNumber"}},{"kind":"Field","name":{"kind":"Name","value":"song"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"achievement"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"elasticsearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active_years"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"inserted_at"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"albums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"length_minutes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"songs_hits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"achievement"}},{"kind":"Field","name":{"kind":"Name","value":"discography"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studio_albums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"length_minutes"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllAboutBandQuery, GetAllAboutBandQueryVariables>;
export const GetGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGenre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGenre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"main_genre"}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetGenreQuery, GetGenreQueryVariables>;
export const GetArtistAndAboutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArtistAndAbout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getArtist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"es_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"born_in"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAllAboutArtist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"es_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"born_in"}},{"kind":"Field","name":{"kind":"Name","value":"database"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"birthdate"}},{"kind":"Field","name":{"kind":"Name","value":"band"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetArtistAndAboutQuery, GetArtistAndAboutQueryVariables>;