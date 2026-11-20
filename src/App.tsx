import { useState } from 'react'
import BandPage from './Band/Band'
import MusicEntrance from './components/MusicEntrance/MusicEntrance'
import MenuPage from './components/MenuPage/MenuPage'
import SearchResults from './SearchResults/SearchResults'

function App() {
  const [search, setSearch] = useState<{ query: string; category: string } | null>(null)
  const [selectedBand, setSelectedBand] = useState<{ id: string; name: string } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (selectedBand) {
    return (
      <BandPage
        id={selectedBand.id}
        name={selectedBand.name}
        onBack={() => setSelectedBand(null)}
      />
    )
  }

  if (search) {
    return (
      <SearchResults
        query={search.query}
        category={search.category}
        results={[]}
        onBack={() => setSearch(null)}
        onSelectBand={setSelectedBand}
      />
    )
  }

  if (isMenuOpen) {
    return <MenuPage onHome={() => setIsMenuOpen(false)} />
  }

  return (
    <MusicEntrance
      onSearch={(query, category) => setSearch({ query, category })}
      onOpenMenu={() => setIsMenuOpen(true)}
    />
  )
}

export default App
