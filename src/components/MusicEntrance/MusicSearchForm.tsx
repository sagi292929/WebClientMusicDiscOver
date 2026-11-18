import { useState } from 'react'
import type { FormEvent } from 'react'
import MusicCategoryDropdown from './MusicCategoryDropdown'
import './MusicSearchForm.css'

type MusicSearchFormProps = {
  onSearch: (query: string, category: string) => void
}

function MusicSearchForm({ onSearch }: MusicSearchFormProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      onSearch(trimmedQuery, selectedCategory)
    }
  }

  return (
    <form className="music-search" onSubmit={handleSubmit}>
      <MusicCategoryDropdown
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <input
        type="search"
        name="q"
        placeholder="Search artists, albums, and tracks"
        aria-label="Search artists, albums, and tracks"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        className="music-search-submit"
        type="submit"
        aria-label="Search"
        disabled={!query.trim()}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      </button>
    </form>
  )
}

export default MusicSearchForm
