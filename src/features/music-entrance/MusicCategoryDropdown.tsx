import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import { getMusicCategoryIcon, musicCategories } from './categoryIcons'

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

  return (
    <FormControl
      size="small"
      sx={{
        width: 96,
        flex: '0 0 96px',
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
              {getMusicCategoryIcon(value)}
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
            justifyContent: 'center',
            gap: 0.5,
            py: 0,
            pl: 1,
            pr: 3,
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
        {musicCategories.map((category) => (
          <MenuItem key={category} value={category}>
            <ListItemIcon sx={{ minWidth: 28, color: 'text.secondary' }}>
              {getMusicCategoryIcon(category)}
            </ListItemIcon>
            <ListItemText primary={category} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MusicCategoryDropdown
