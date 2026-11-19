import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import MusicSearchForm from './MusicSearchForm'

type MusicEntranceProps = {
  onSearch: (query: string, category: string) => void
}

function MusicEntrance({ onSearch }: MusicEntranceProps) {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          minHeight: { xs: 68, sm: 76 },
          alignItems: 'center',
          gap: { xs: 2, sm: 6 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          px: { xs: 2.25, sm: 5, md: 9 },
          py: 1.75,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Link
          href="/"
          underline="none"
          color="text.primary"
          aria-label="Music DiskOver home"
          sx={{
            display: 'inline-flex',
            flex: '0 0 auto',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography component="span" variant="h6" aria-hidden="true" color="primary">
            ♫
          </Typography>
          <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
            Music DiskOver
          </Typography>
        </Link>
        <MusicSearchForm onSearch={onSearch} />
      </Box>
    </Box>
  )
}

export default MusicEntrance
