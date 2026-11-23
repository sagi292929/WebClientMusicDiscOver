import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ReactNode } from 'react'

const categories = ['All', 'Band', 'Artist', 'Album', 'Song', 'Genre'] as const
type Category = (typeof categories)[number]

const categoryIcons: Record<Category, ReactNode> = {
  All: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  ),
  Band: <i className="fa-solid fa-people-group" aria-hidden="true" />,
  Artist: <i className="fa-solid fa-microphone" aria-hidden="true" />,
  Album: <i className="fa-solid fa-record-vinyl" aria-hidden="true" />,
  Song: <i className="fa-solid fa-music" aria-hidden="true" />,
  Genre: <i className="fa-solid fa-icons" aria-hidden="true" />,
}

type MusicCategoryDropdownProps = {
  selectedCategory: string
  onSelect: (category: string) => void
}

function MusicCategoryDropdown({
  selectedCategory,
  onSelect,
}: MusicCategoryDropdownProps) {
  function handleChange(event: SelectChangeEvent<string>) {
    onSelect(event.target.value)
  }

  function renderIcon(category: string) {
    return categories.includes(category as Category)
      ? categoryIcons[category as Category]
      : null
  }

  return (
    <FormControl
      size="small"
      sx={{
        width: 64,
        flex: '0 0 64px',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <Select
        variant="standard"
        disableUnderline
        value={selectedCategory}
        onChange={handleChange}
        aria-label={`Search category: ${selectedCategory}`}
        renderValue={(value) => (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              {renderIcon(value)}
            </Box>
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {value}
            </Box>
          </Box>
        )}
        sx={{
          height: 26,
          color: 'text.primary',
          fontSize: 13,
          '& .MuiSelect-select': {
            minHeight: '26px !important',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            py: 0,
            pl: 0,
            pr: 1,
          },
          '& .MuiSelect-icon': {
            right: 4,
            color: 'text.secondary',
            fontSize: 18,
          },
        }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: { minWidth: 180 },
            },
          },
        }}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            <ListItemIcon sx={{ minWidth: 28, color: 'text.secondary' }}>
              {categoryIcons[category]}
            </ListItemIcon>
            <ListItemText primary={category} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MusicCategoryDropdown
