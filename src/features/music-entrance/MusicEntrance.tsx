import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import MusicSearchForm from './MusicSearchForm'

type MusicEntranceProps = {
  onSearch: (query: string, category: string) => void
  onOpenMenu: () => void
  userName: string | null
}

function MusicEntrance({ onSearch, onOpenMenu, userName }: MusicEntranceProps) {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          minHeight: { xs: 68, sm: 76 },
          alignItems: 'center',
          gap: { xs: 1.75, sm: 4 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          px: { xs: 2.25, sm: 5, md: 9 },
          py: 1.75,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: '0 0 auto',
          }}
        >
          <IconButton
            aria-label="Open menu"
            onClick={onOpenMenu}
            color="primary"
            sx={{ flex: '0 0 auto' }}
          >
            <i className="fa-solid fa-bars" aria-hidden="true" />
          </IconButton>
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
        </Box        >
          <MusicSearchForm onSearch={onSearch} />
          {userName && (
            <Typography
              component="span"
              color="text.primary"
              sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
            >
              {userName}
            </Typography>
          )}
          <Button
            component={RouterLink}
            to="/sign-in"
            variant="outlined"
            sx={{ ml: 'auto', flex: '0 0 auto' }}
          >
            Sign in
          </Button>
        </Box>
    </Box>
  )
}

export default MusicEntrance
