import { useState } from 'react'
import MusicEntrance from './components/MusicEntrance/MusicEntrance'
import SearchResults from './SearchResults/SearchResults'

function App() {
  const [search, setSearch] = useState<{ query: string; category: string } | null>(null)

  if (search) {
    return (
      <SearchResults
        query={search.query}
        category={search.category}
        results={[]}
        onBack={() => setSearch(null)}
      />
    )
  }

  return <MusicEntrance onSearch={(query, category) => setSearch({ query, category })} />
}

export default App
