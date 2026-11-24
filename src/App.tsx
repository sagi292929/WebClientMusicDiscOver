import { useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import BandPage from './features/band/Band'
import GenrePage from './features/genre/Genre'
import SongPage from './features/song/Song'
import MusicEntrance from './features/music-entrance/MusicEntrance'
import MenuPage from './pages/MenuPage'
import SearchResults from './features/search/SearchResults'
import ArtistPage from './features/artist/Artist'
import AlbumPage from './features/album/Album'

function SongRoute() {
  const { id } = useParams()
  const navigate = useNavigate()

  return <SongPage id={id ?? ''} onBack={() => navigate('/')} />
}

function AlbumRoute() {
  const { id } = useParams()
  const navigate = useNavigate()

  return <AlbumPage id={id ?? ''} onBack={() => navigate('/')} />
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

function ArtistRoute() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { searchQuery?: string; artistName?: string } | null

  return (
    <ArtistPage
      id={id ?? ''}
      name={state?.artistName ?? ''}
      searchQuery={state?.searchQuery ?? ''}
      onBack={() => navigate('/')}
    />
  )
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
        <Route path="albums/:id" element={<AlbumRoute />} />
        <Route path="genres/:id" element={<GenreRoute />} />
        <Route path="songs/:id" element={<SongRoute />} />
        <Route path="artists/:id" element={<ArtistRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
