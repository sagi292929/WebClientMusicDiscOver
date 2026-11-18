import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { formatActiveYears } from './components/MusicEntrance/utils'
import './SearchResults.css'
import type { BandMatch, QueryGetBandArgs } from './gql/generated'

const GET_BAND_QUERY = gql`
  query GetBand($name: String!) {
    getBand(name: $name) {
      id
      name
      active_years
    }
  }
`

type GetBandQuery = {
  getBand: BandMatch[]
}

export type SearchResultItem = {
  id: string
  title: string
  subtitle?: string
  details?: string
  category?: string
  fields?: Array<{ label: string; value: string }>
}

type SearchResultsProps = {
  query: string
  category: string
  results: SearchResultItem[]
  onBack: () => void
}

function SearchResults({ query, category, results, onBack }: SearchResultsProps) {
  const isBandSearch = category === 'Band'
  const { data: bandData, loading: bandLoading, error: bandError } = useQuery<
    GetBandQuery,
    QueryGetBandArgs
  >(GET_BAND_QUERY, {
    variables: { name: query },
    skip: !isBandSearch,
  })
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
    : results

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
          {displayedResults.length > 0 && (
            <span>
              {displayedResults.length} {displayedResults.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {isBandSearch && bandLoading ? (
          <div className="search-results-empty" role="status">
            <strong>Searching bands…</strong>
          </div>
        ) : isBandSearch && bandError ? (
          <div className="search-results-empty" role="alert">
            <strong>Could not load band results</strong>
            <span>{bandError.message}</span>
          </div>
        ) : displayedResults.length > 0 ? (
          <ul className="search-results-list">
            {displayedResults.map((result, index) => (
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
        ) : (
          <div className="search-results-empty">
            <span className="search-results-empty-icon" aria-hidden="true">
              <i className="fa-solid fa-music" />
            </span>
            <strong>Results will appear here</strong>
            <span>
              {isBandSearch
                ? 'No bands matched this search.'
                : 'Search is ready to connect to the music catalog.'}
            </span>
          </div>
        )}
      </section>
    </main>
  )
}

export default SearchResults
