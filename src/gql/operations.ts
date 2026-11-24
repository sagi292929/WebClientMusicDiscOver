import { gql } from '@apollo/client'
import type {
  AlbumMatch,
  AllAboutArtist,
  ArtistBand,
  ArtistDatabaseDetails,
  ArtistInstrument,
  ArtistMatch,
  AllAboutBandSummary,
  AllAboutGenre,
  Band,
  BandAlbum,
  BandMember,
  BandSongHit,
  BandMatch,
  Maybe,
  SqlAlbumSong,
  SqlAlbumSummary,
  SqlArtistSummary,
  SqlBandSummary,
  SqlInstrumentSummary,
  SqlSong,
  StudioAlbum,
  SongMatch,
} from './generated'

export type GetSongQueryVariables = {
  name: string
}

export type GetSongQuery = {
  getSong: Array<Pick<SongMatch, 'es_id' | 'name' | 'band_name'>>
}

export const GetSongDocument = gql`
  query GetSong($name: String!) {
    getSong(name: $name) {
      es_id
      name
      band_name
    }
  }
`

export type GetAllAboutSongQueryVariables = {
  id: number
}

type SongDatabaseDetails = Pick<SqlSong, 'achievement' | 'hit' | 'title' | 'year'>

export type GetAllAboutSongQuery = {
  getAllAboutSong?: Maybe<{
    database?: Maybe<SongDatabaseDetails>
    elasticsearch?: Maybe<unknown>
  }>
}

export const GetAllAboutSongDocument = gql`
  query GetAllAboutSong($id: Int!) {
    getAllAboutSong(id: $id) {
      database {
        title
        year
        achievement
        hit
      }
      elasticsearch
    }
  }
`

export type GetBandSongIdsQueryVariables = {
  id: string
}

export type GetBandSongIdsQuery = {
  getAllAboutBand?: Maybe<{
    database?: Maybe<
      Pick<SqlBandSummary, 'albums'> & {
        albums: Array<
          Pick<SqlAlbumSummary, 'albumSongs'> & {
            albumSongs: Array<{
              song: Pick<SqlSong, 'Id' | 'title'>
            }>
          }
        >
      }
    >
  }>
}

export const GetBandSongIdsDocument = gql`
  query GetBandSongIds($id: String!) {
    getAllAboutBand(id: $id) {
      database {
        albums {
          albumSongs {
            song {
              Id
              title
            }
          }
        }
      }
    }
  }
`

export type GetAlbumQueryVariables = {
  name: string
}

export type GetAlbumQuery = {
  getAlbum: Array<Pick<AlbumMatch, 'es_id' | 'name' | 'band_name'>>
}

export const GetAlbumDocument = gql`
  query GetAlbum($name: String!) {
    getAlbum(name: $name) {
      es_id
      name
      band_name
    }
  }
`

export type GetAllAboutAlbumQueryVariables = {
  id: string
}

export type GetAllAboutAlbumQuery = {
  getAllAboutAlbum?: Maybe<{
    id: string
    database?: Maybe<{
      Id: number
      BandId: number
      albumSongs: Array<{
        albumId: number
        songId: number
        trackNumber: number
        song: Pick<SqlSong, 'Id' | 'achievement' | 'es_id' | 'hit' | 'title' | 'year'>
      }>
    }>
    elasticsearch?: Maybe<unknown>
  }>
}

export const GetAllAboutAlbumDocument = gql`
  query GetAllAboutAlbum($id: String!) {
    getAllAboutAlbum(id: $id) {
      id
      database {
        Id
        BandId
        albumSongs {
          albumId
          songId
          trackNumber
          song {
            Id
            achievement
            es_id
            hit
            title
            year
          }
        }
      }
      elasticsearch
    }
  }
`

export type GetBandQueryVariables = {
  name: string
}

export type GetBandQuery = {
  getBand: Array<Pick<BandMatch, 'id' | 'name' | 'active_years'>>
}

export const GetBandDocument = gql`
  query GetBand($name: String!) {
    getBand(name: $name) {
      id
      name
      active_years
    }
  }
`

type BandSqlArtistDetails = Pick<SqlArtistSummary, 'birthdate' | 'es_id' | 'name'> & {
  artistInstruments: Array<{
    instrument: Pick<SqlInstrumentSummary, 'Type' | 'name'>
  }>
}

type BandSqlAlbumDetails = Pick<SqlAlbumSummary, 'lengthMinutes' | 'title' | 'year'> & {
  albumArtists: Array<{
    artist: BandSqlArtistDetails
  }>
  albumSongs: Array<
    Pick<SqlAlbumSong, 'albumId' | 'songId' | 'trackNumber'> & {
      song: Pick<SqlSong, 'Id' | 'achievement' | 'hit' | 'title' | 'year'>
    }
  >
}

type BandElasticsearchDetails = Pick<Band, 'active_years' | 'genres' | 'id' | 'inserted_at' | 'name'> & {
  albums: Array<Pick<BandAlbum, 'id' | 'length_minutes' | 'name' | 'year'>>
  members: Array<Pick<BandMember, 'id' | 'name'>>
  songs_hits: Array<
    Pick<BandSongHit, 'achievement' | 'title' | 'year'> & {
      discography?: Maybe<{
        studio_albums: Array<Pick<StudioAlbum, 'id' | 'length_minutes' | 'name' | 'year'>>
      }>
    }
  >
}

type BandDatabaseDetails = Pick<
  SqlBandSummary,
  'Id' | 'es_id' | 'name' | 'officialWebsite' | 'origin' | 'rockAndRollHallOfFameInduction'
> & {
  albums: BandSqlAlbumDetails[]
  artists: BandSqlArtistDetails[]
}

export type GetAllAboutBandQueryVariables = {
  id: string
}

export type GetAllAboutBandQuery = {
  getAllAboutBand?: Maybe<
    Pick<AllAboutBandSummary, 'active_years' | 'genres' | 'id' | 'inserted_at' | 'name'> & {
      albums: Array<Pick<BandAlbum, 'id' | 'length_minutes' | 'name' | 'year'>>
      database?: Maybe<BandDatabaseDetails>
      elasticsearch?: Maybe<BandElasticsearchDetails>
      members: Array<Pick<BandMember, 'id' | 'name'>>
      songs_hits: Array<
        Pick<BandSongHit, 'achievement' | 'title' | 'year'> & {
          discography?: Maybe<{
            studio_albums: Array<Pick<StudioAlbum, 'id' | 'length_minutes' | 'name' | 'year'>>
          }>
        }
      >
    }
  >
}

export const GetAllAboutBandDocument = gql`
  query GetAllAboutBand($id: String!) {
    getAllAboutBand(id: $id) {
      id
      name
      active_years
      genres
      inserted_at
      members {
        id
        name
      }
      albums {
        id
        name
        year
        length_minutes
      }
      songs_hits {
        title
        year
        achievement
        discography {
          studio_albums {
            id
            name
            year
            length_minutes
          }
        }
      }
      database {
        Id
        es_id
        name
        origin
        officialWebsite
        rockAndRollHallOfFameInduction
        artists {
          es_id
          name
          birthdate
          artistInstruments {
            instrument {
              name
              Type
            }
          }
        }
        albums {
          title
          year
          lengthMinutes
          albumArtists {
            artist {
              es_id
              name
              birthdate
              artistInstruments {
                instrument {
                  name
                  Type
                }
              }
            }
          }
          albumSongs {
            albumId
            songId
            trackNumber
            song {
              Id
              title
              year
              achievement
              hit
            }
          }
        }
      }
      elasticsearch {
        id
        name
        active_years
        genres
        inserted_at
        members {
          id
          name
        }
        albums {
          id
          name
          year
          length_minutes
        }
        songs_hits {
          title
          year
          achievement
          discography {
            studio_albums {
              id
              name
              year
              length_minutes
            }
          }
        }
      }
    }
  }
`

export type GetGenreQueryVariables = {
  name?: string | null
}

export type GetGenreQuery = {
  getGenre: Array<{
    main_genre: string | null
    genres: Array<{
      Id: number
      name: string
    }>
  }>
}

export type GetAllAboutGenreQueryVariables = {
  id: number
}

export type GetAllAboutGenreQuery = {
  getAllAboutGenre?: Maybe<
    Pick<AllAboutGenre, 'Id' | 'main_genre' | 'name'> & {
      bands: Array<Pick<AllAboutGenre['bands'][number], 'Id' | 'es_id' | 'name' | 'officialWebsite' | 'origin'>>
    }
  >
}

export const GetAllAboutGenreDocument = gql`
  query GetAllAboutGenre($id: Int!) {
    getAllAboutGenre(id: $id) {
      Id
      name
      main_genre
      bands {
        Id
        es_id
        name
        officialWebsite
        origin
      }
    }
  }
`

export const GetGenreDocument = gql`
  query GetGenre($name: String) {
    getGenre(name: $name) {
      main_genre
      genres {
        Id
        name
      }
    }
  }
`

type ArtistSearchMatch = Pick<ArtistMatch, 'es_id' | 'name' | 'born_in'>
type ArtistSearchDetails = Pick<AllAboutArtist, 'es_id' | 'name' | 'born_in'> & {
  database?: Maybe<
    Pick<ArtistDatabaseDetails, 'birthdate'> & {
      band: Pick<ArtistBand, 'name'>
      instruments: Array<Pick<ArtistInstrument, 'name'>>
    }
  >
}

export type GetArtistAndAboutQueryVariables = {
  name: string
}

export type GetArtistAndAboutQuery = {
  getArtist: ArtistSearchMatch[]
  getAllAboutArtist: ArtistSearchDetails[]
}

export const GetArtistAndAboutDocument = gql`
  query GetArtistAndAbout($name: String!) {
    getArtist(name: $name) {
      es_id
      name
      born_in
    }
    getAllAboutArtist(name: $name) {
      es_id
      name
      born_in
      database {
        birthdate
        band {
          name
        }
        instruments {
          name
          Type
        }
      }
    }
  }
`

export type GetAllAboutArtistQueryVariables = {
  name: string
  limit: number
}

export type GetAllAboutArtistQuery = {
  getAllAboutArtist: Array<{
    es_id: string
    name: string
    born_in?: Maybe<string>
    former_bands: string[]
    elasticsearch: {
      es_id: string
      name: string
      born_in?: Maybe<string>
      former_bands: string[]
    }
    database?: Maybe<{
      Id: number
      es_id: string
      name: string
      birthdate: string
      band: {
        Id: number
        es_id: string
        name: string
        officialWebsite: string
        origin: string
        rockAndRollHallOfFameInduction?: Maybe<number>
      }
      instruments: Array<{
        name: string
        Type: string
      }>
      albums: Array<{
        albumId: number
        album: {
          Id: number
          title: string
          year: number
          lengthMinutes: string
          songs: Array<{
            achievement: string
            hit: boolean
            title: string
            year: number
          }>
        }
      }>
    }>
  }>
}

export const GetAllAboutArtistDocument = gql`
  query GetAllAboutArtist($name: String!, $limit: Int!) {
    getAllAboutArtist(name: $name, limit: $limit) {
      es_id
      name
      born_in
      former_bands
      elasticsearch {
        es_id
        name
        born_in
        former_bands
      }
      database {
        Id
        es_id
        name
        birthdate
        band {
          Id
          es_id
          name
          officialWebsite
          origin
          rockAndRollHallOfFameInduction
        }
        instruments {
          name
          Type
        }
        albums {
          albumId
          album {
            Id
            title
            year
            lengthMinutes
            songs {
              achievement
              hit
              title
              year
            }
          }
        }
      }
    }
  }
`
