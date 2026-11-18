import './MusicEntrance.css'
import MusicSearchForm from './MusicSearchForm'

type MusicEntranceProps = {
  onSearch: (query: string, category: string) => void
}

function MusicEntrance({ onSearch }: MusicEntranceProps) {
  return (
    <main className="music-entrance">
      <header className="music-banner">
        <a className="music-brand" href="/" aria-label="Music DiskOver home">
          <span className="music-brand-mark" aria-hidden="true">♫</span>
          <span>Music DiskOver</span>
        </a>
        <MusicSearchForm onSearch={onSearch} />
      </header>
    </main>
  )
}

export default MusicEntrance
