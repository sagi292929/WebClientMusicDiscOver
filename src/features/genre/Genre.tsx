import { useQuery } from '@apollo/client/react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import {
  GetAllAboutGenreDocument,
  type GetAllAboutGenreQuery,
  type GetAllAboutGenreQueryVariables,
} from '../../gql/operations'

type GenrePageProps = {
  id: string
  onBack: () => void
}

function GenrePage({ id, onBack }: GenrePageProps) {
  const genreId = Number(id)
  const hasValidId = id.trim() !== '' && Number.isSafeInteger(genreId)
  const { data, loading, error } = useQuery<
    GetAllAboutGenreQuery,
    GetAllAboutGenreQueryVariables
  >(GetAllAboutGenreDocument, {
    variables: { id: hasValidId ? genreId : 0 },
    skip: !hasValidId,
  })
  const genre = data?.getAllAboutGenre

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          minHeight: { xs: 68, sm: 76 },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: { xs: 2.25, sm: 5, md: 9 },
          py: 1.75,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Link
          href="/"
          onClick={(event) => {
            event.preventDefault()
            onBack()
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
        <Button
          type="button"
          variant="outlined"
          onClick={onBack}
          startIcon={<i className="fa-solid fa-arrow-left" aria-hidden="true" />}
        >
          Back to results
        </Button>
      </Box>

      <Box
        component="section"
        aria-labelledby="genre-title"
        sx={{ width: 'calc(100% - 40px)', maxWidth: 1080, mx: 'auto', py: { xs: 5, sm: 8 } }}
      >
        <Stack spacing={3}>
          <Typography
            component="h1"
            variant="h3"
            id="genre-title"
            sx={{ overflowWrap: 'anywhere', fontWeight: 700, letterSpacing: '-0.055em' }}
          >
            {genre?.name ?? 'Genre details'}
          </Typography>

          {!hasValidId && (
            <Alert severity="error" role="alert">
              <AlertTitle>Could not load genre details</AlertTitle>
              The genre URL must contain a numeric genre ID.
            </Alert>
          )}
          {hasValidId && loading && (
            <Paper variant="outlined" sx={{ p: 4 }}>
              <Stack direction="row" spacing={1.5} role="status" sx={{ alignItems: 'center' }}>
                <CircularProgress size={20} />
                <Typography>Loading genre details…</Typography>
              </Stack>
            </Paper>
          )}
          {hasValidId && error && (
            <Alert severity="error" role="alert">
              <AlertTitle>Could not load genre details</AlertTitle>
              {error.message}
            </Alert>
          )}
          {hasValidId && !loading && !error && !genre && (
            <Alert severity="info" role="status">
              No details were found for this genre.
            </Alert>
          )}

          {genre && (
            <>
              <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack spacing={1.5}>
                  <Typography component="h2" variant="h5" sx={{ fontWeight: 650 }}>
                    Genre details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Box component="strong" sx={{ color: 'text.primary' }}>Main genre:</Box>{' '}
                    {genre.main_genre ?? 'Not available'}
                  </Typography>
                </Stack>
              </Paper>

              <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack spacing={2}>
                  <Typography component="h2" variant="h5" sx={{ fontWeight: 650 }}>
                    Bands ({genre.bands.length})
                  </Typography>
                  {genre.bands.length === 0 ? (
                    <Typography color="text.secondary">No bands are associated with this genre.</Typography>
                  ) : (
                    <List disablePadding>
                      {genre.bands.map((band) => (
                        <ListItem key={band.Id} divider sx={{ display: 'block', py: 1.5 }}>
                          <Stack spacing={0.5}>
                            <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {band.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {band.Id} · Catalog ID: {band.es_id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Origin: {band.origin || 'Not available'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Website:{' '}
                              {band.officialWebsite ? (
                                <Link href={band.officialWebsite} target="_blank" rel="noreferrer">
                                  {band.officialWebsite}
                                </Link>
                              ) : (
                                'Not available'
                              )}
                            </Typography>
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Stack>
              </Paper>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default GenrePage
