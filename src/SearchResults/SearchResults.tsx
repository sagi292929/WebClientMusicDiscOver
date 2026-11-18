import { useQuery } from '@apollo/client/react'
import { formatActiveYears } from '../components/MusicEntrance/utils'
import './SearchResults.css'
import {
  GetArtistAndAboutDocument,
  GetBandDocument,
  type GetArtistAndAboutQuery,
  type GetArtistAndAboutQueryVariables,
  type GetBandQuery,
  type GetBandQueryVariables,
} from '../gql/generated'

const artistResultFieldOrder = ['Name', 'Born in', 'Band', 'Instruments'] as const

function formatInstrumentName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

export type SearchResultItem = {
  id: string
  title: string
  subtitle?: string
  details?: string
  category?: string
  fields?: Array<{ label: string; value: string }>
}

function sortSearchResults(
  results: SearchResultItem[],
  searchText: string,
): SearchResultItem[] {
  const normalizedSearchText = searchText.trim().toLowerCase()
  const secondWord = normalizedSearchText.split(/\s+/)[1]
  if (!normalizedSearchText) {
    return results
  }

  return results
    .map((result, index) => {
      const title = result.title.trim().toLowerCase()
      const rank = title.startsWith(normalizedSearchText)
        ? 0
        : secondWord && title.startsWith(secondWord)
          ? 1
          : 2
      return { result, index, rank }
    })
    .sort((first, second) => first.rank - second.rank || first.index - second.index)
    .map(({ result }) => result)
}

type SearchResultsProps = {
  query: string
  category: string
  results: SearchResultItem[]
  onBack: () => void
}

function SearchResults({ query, category, results, onBack }: SearchResultsProps) {
  const isBandSearch = category === 'Band'
  const isArtistSearch = category === 'Artist'
  const { data: bandData, loading: bandLoading, error: bandError } = useQuery<
    GetBandQuery,
    GetBandQueryVariables
  >(GetBandDocument, {
    variables: { name: query },
    skip: !isBandSearch,
  })
  const {
    data: artistData,
    loading: artistLoading,
    error: artistError,
  } = useQuery<GetArtistAndAboutQuery, GetArtistAndAboutQueryVariables>(
    GetArtistAndAboutDocument,
    {
      variables: { name: query },
      skip: !isArtistSearch,
      errorPolicy: 'all',
    },
  )

  const artistDetailsById = new Map(
    (artistData?.getAllAboutArtist ?? []).map((artist) => [artist.es_id, artist]),
  )
  const artistMatches = new Map(
    (artistData?.getArtist ?? []).map((artist) => [artist.es_id, artist]),
  )
  for (const artist of artistDetailsById.values()) {
    if (!artistMatches.has(artist.es_id)) {
      artistMatches.set(artist.es_id, artist)
    }
  }

  const displayedResults: SearchResultItem[] = isBandSearch
    ? (bandData?.getBand ?? []).map((band) => ({
        id: band.id,
        title: band.name,
        category: 'Band',
        fields: [
          { label: 'ID', value: band.id },
          {
            label: 'Active years',
            value: band.active_years.length > 0
              ? formatActiveYears(band.active_years)
              : 'Not available',
          },
        ],
      }))
    : isArtistSearch
      ? [...artistMatches.values()].map((artist) => {
          const details = artistDetailsById.get(artist.es_id)
          const database = details?.database
          const artistValues = {
            Name: artist.name,
            'Born in': artist.born_in ?? database?.birthdate ?? 'Not available',
            Band: database?.band.name ?? 'Not available',
            Instruments: database?.instruments
              .map(({ name }) => formatInstrumentName(name))
              .join(', ')
              || 'Not available',
          }
          const [titleField, ...fields] = artistResultFieldOrder.map((label) => ({
            label,
            value: artistValues[label],
          }))

          return {
            id: artist.es_id,
            title: titleField.value,
            category: 'Artist',
            fields,
          }
        })
      : results

  const sortedResults = sortSearchResults(displayedResults, query)

  return (
    <main className="search-results-page">
      <header className="search-results-header">
        <a className="music-brand" href="/" aria-label="Music DiskOver home">
          <span className="music-brand-mark" aria-hidden="true">♫</span>
          <span>Music DiskOver</span>
        </a>
        <button className="search-results-back" type="button" onClick={onBack}>
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          <span>New search</span>
        </button>
      </header>

      <section className="search-results-content" aria-labelledby="search-results-title">
        <h1 id="search-results-title">Search results for: &quot;{query}&quot;</h1>
        <p className="search-results-category">
          <span>Category</span>
          <strong>{category}</strong>
        </p>

        <div className="search-results-list-heading">
          <h2>Results</h2>
          {sortedResults.length > 0 && (
            <span>
              {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {(isBandSearch && bandLoading) || (isArtistSearch && artistLoading) ? (
          <div className="search-results-empty" role="status">
            <strong>{isBandSearch ? 'Searching bands…' : 'Searching artists…'}</strong>
          </div>
        ) : isBandSearch && bandError ? (
          <div className="search-results-empty" role="alert">
            <strong>Could not load band results</strong>
            <span>{bandError.message}</span>
          </div>
        ) : isArtistSearch && artistError && sortedResults.length === 0 ? (
          <div className="search-results-empty" role="alert">
            <strong>Could not load artist results</strong>
            <span>{artistError.message}</span>
          </div>
        ) : sortedResults.length > 0 ? (
          <>
            {isArtistSearch && artistError && (
              <div className="search-results-empty" role="alert">
                <strong>Some artist details could not be loaded</strong>
                <span>{artistError.message}</span>
              </div>
            )}
            <ul className="search-results-list">
              {sortedResults.map((result, index) => (
                <li className="search-result-row" key={result.id}>
                  <span className="search-result-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="search-result-art" aria-hidden="true">
                    <i className="fa-solid fa-music" />
                  </span>
                  <span className="search-result-copy">
                    <strong>{result.title}</strong>
                    {result.subtitle && <span>{result.subtitle}</span>}
                    {result.fields?.map((field) => (
                      <span className="search-result-field" key={field.label}>
                        <strong>{field.label}:</strong> {field.value}
                      </span>
                    ))}
                  </span>
                  {result.details && <span className="search-result-details">{result.details}</span>}
                  <span className="search-result-type">{result.category ?? category}</span>
                  <i className="fa-solid fa-chevron-right search-result-arrow" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="search-results-empty">
            <span className="search-results-empty-icon" aria-hidden="true">
              <i className="fa-solid fa-music" />
            </span>
            <strong>Results will appear here</strong>
            <span>
              {isBandSearch
                ? 'No bands matched this search.'
                : isArtistSearch
                  ? 'No artists matched this search.'
                  : 'Search is ready to connect to the music catalog.'}
            </span>
          </div>
        )}
      </section>
    </main>
  )
}

export default SearchResults
