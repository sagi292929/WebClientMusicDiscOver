import { gql } from '@apollo/client'
import type {
  AlbumMatch,
  AllAboutArtist,
  ArtistBand,
  ArtistDatabaseDetails,
  ArtistInstrument,
  ArtistMatch,
  AllAboutBandSummary,
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

export type GetAlbumQueryVariables = {
  name: string
}

export type GetAlbumQuery = {
  getAlbum: Array<Pick<AlbumMatch, 'Id' | 'title' | 'bandName' | 'year' | 'lengthMinutes'>>
}

export const GetAlbumDocument = gql`
  query GetAlbum($name: String!) {
    getAlbum(name: $name) {
      Id
      title
      bandName
      year
      lengthMinutes
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

export const GetGenreDocument = gql`
  query GetGenre {
    getGenre {
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
