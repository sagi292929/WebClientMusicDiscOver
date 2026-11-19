import { useState } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { GetGenreDocument } from '../../gql/operations'
import type { GetGenreQuery } from '../../gql/generated'

type MenuPageProps = {
  onHome: () => void
}

function MenuPage({ onHome }: MenuPageProps) {
  const [loadGenres, { data, loading, error }] = useLazyQuery<GetGenreQuery>(
    GetGenreDocument,
  )
  const [showGenreWorld, setShowGenreWorld] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(() => new Set())

  function toggleMainGenre(genres: GetGenreQuery['getGenre'][number]['genres'], checked: boolean) {
    setSelectedGenres((selected) => {
      const next = new Set(selected)
      for (const { Id } of genres) {
        if (checked) {
          next.add(Id)
        } else {
          next.delete(Id)
        }
      }
      return next
    })
  }

  function toggleGenre(id: number, checked: boolean) {
    setSelectedGenres((selected) => {
      const next = new Set(selected)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          minHeight: { xs: 68, sm: 76 },
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.25, sm: 5, md: 9 },
          py: 1.75,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link
            href="/"
            onClick={(event) => {
              event.preventDefault()
              onHome()
            }}
            underline="none"
            color="text.primary"
            aria-label="Music DiskOver home"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
          >
            <Typography component="span" variant="h6" aria-hidden="true" color="primary">
              ♫
            </Typography>
            <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
              Music DiskOver
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box sx={{ width: 'calc(100% - 40px)', maxWidth: 1080, mx: 'auto', py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3 }}>
          <Button onClick={onHome} variant="outlined">
            Return to main
          </Button>
        </Box>
        {showGenreWorld ? (
          <Stack spacing={2}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              Select music bands by genres
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" disabled={selectedGenres.size === 0}>
                Search
              </Button>
            </Box>
            {loading ? (
              <Box role="status" sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" role="alert">
                Could not load genres: {error.message}
              </Alert>
            ) : data?.getGenre.length === 0 ? (
              <Typography color="text.secondary">No genres are available.</Typography>
            ) : (
              data?.getGenre.map(({ main_genre: mainGenre, genres }, index) => {
                const selectedCount = genres.filter(({ Id }) => selectedGenres.has(Id)).length
                const allSelected = genres.length > 0 && selectedCount === genres.length

                return (
                <Accordion key={mainGenre}>
                  <AccordionSummary
                    expandIcon={<i className="fa-solid fa-chevron-down" aria-hidden="true" />}
                    aria-controls={`genre-panel-${index}`}
                    id={`genre-header-${index}`}
                  >
                    <Checkbox
                      checked={allSelected}
                      indeterminate={selectedCount > 0 && !allSelected}
                      disabled={genres.length === 0}
                      onClick={(event) => event.stopPropagation()}
                      onFocus={(event) => event.stopPropagation()}
                      onChange={(event) => toggleMainGenre(genres, event.target.checked)}
                      slotProps={{ input: { 'aria-label': `Select all ${mainGenre} genres` } }}
                    />
                    <Typography component="h2" sx={{ fontWeight: 600 }}>
                      {mainGenre}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails id={`genre-panel-${index}`}>
                    <List disablePadding>
                      {genres.map(({ Id, name }) => (
                        <ListItem key={Id} divider sx={{ gap: 1 }}>
                          <Checkbox
                            checked={selectedGenres.has(Id)}
                            onChange={(event) => toggleGenre(Id, event.target.checked)}
                            slotProps={{ input: { 'aria-label': name } }}
                          />
                          {name}
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
                )
              })
            )}
          </Stack>
        ) : (
          <Stack sx={{ alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowGenreWorld(true)
                loadGenres()
              }}
            >
              Genre world
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default MenuPage
