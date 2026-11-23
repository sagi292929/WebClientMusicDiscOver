import { useState } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import BandPage from './Band/Band'
import GenrePage from './Genre/Genre'
import SongPage from './Song/Song'
import MusicEntrance from './components/MusicEntrance/MusicEntrance'
import MenuPage from './components/MenuPage/MenuPage'
import SearchResults from './SearchResults/SearchResults'

function SongRoute() {
  const { id } = useParams()
  const navigate = useNavigate()

  return <SongPage id={id ?? ''} onBack={() => navigate('/')} />
}

function BandRoute() {
  const { id } = useParams()
  const navigate = useNavigate()

  return <BandPage id={id ?? ''} onBack={() => navigate('/')} />
}

function GenreRoute() {
  const { id } = useParams()
  const navigate = useNavigate()

  return <GenrePage id={id ?? ''} onBack={() => navigate('/')} />
}

function App() {
  const [search, setSearch] = useState<{ query: string; category: string } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route
          index
          element={
            search ? (
              <SearchResults
                query={search.query}
                category={search.category}
                results={[]}
                onBack={() => setSearch(null)}
              />
            ) : isMenuOpen ? (
              <MenuPage onHome={() => setIsMenuOpen(false)} />
            ) : (
              <MusicEntrance
                onSearch={(query, category) => setSearch({ query, category })}
                onOpenMenu={() => setIsMenuOpen(true)}
              />
            )
          }
        />
        <Route path="bands/:id" element={<BandRoute />} />
        <Route path="genres/:id" element={<GenreRoute />} />
        <Route path="songs/:id" element={<SongRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
