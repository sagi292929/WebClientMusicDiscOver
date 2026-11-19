import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import { useState } from 'react'
import type { FormEvent } from 'react'
import MusicCategoryDropdown from './MusicCategoryDropdown'

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        width: 'min(100%, 560px)',
        height: 44,
        alignItems: 'center',
        gap: 1.5,
        px: 1.875,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.secondary',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: '0 0 0 3px rgb(198 255 0 / 12%)',
        },
        '@media (max-width: 600px)': {
          width: '100%',
        },
      }}
    >
      <MusicCategoryDropdown
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <InputBase
        sx={{
          flex: 1,
          minWidth: 0,
          color: 'text.primary',
          fontSize: 14,
          '& input': {
            py: 0,
          },
          '& input::placeholder': {
            color: 'text.secondary',
            opacity: 1,
          },
          '& input::-webkit-search-cancel-button': {
            cursor: 'pointer',
          },
        }}
        type="search"
        name="q"
        placeholder="Search artists, albums, and tracks"
        aria-label="Search artists, albums, and tracks"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <IconButton
        type="submit"
        aria-label="Search"
        disabled={!query.trim()}
        size="small"
        sx={{
          width: 30,
          height: 30,
          flex: '0 0 30px',
          borderRadius: 1.5,
          color: 'primary.main',
          '&:hover': { bgcolor: 'action.hover' },
          '&.Mui-disabled': { color: 'text.disabled' },
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          sx={{
            width: 18,
            height: 18,
            fill: 'none',
            stroke: 'currentColor',
            strokeLinecap: 'round',
            strokeWidth: 1.8,
          }}
        >
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </Box>
      </IconButton>
    </Box>
  )
}

export default MusicSearchForm
