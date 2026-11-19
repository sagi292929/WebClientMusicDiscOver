import { gql } from '@apollo/client'
import type {
  AllAboutArtist,
  ArtistBand,
  ArtistDatabaseDetails,
  ArtistInstrument,
  ArtistMatch,
  BandMatch,
  Maybe,
} from './generated'

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
