import { useQuery } from '@apollo/client/react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  GetAllAboutArtistDocument,
  type GetAllAboutArtistQuery,
  type GetAllAboutArtistQueryVariables,
} from '../../gql/operations'

type ArtistPageProps = {
  id: string
  name: string
  searchQuery: string
  onBack: () => void
}

function formatFieldLabel(field: string): string {
  const label = field
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function cleanArtistDetails(item: GetAllAboutArtistQuery['getAllAboutArtist'][number]) {
  const details: Record<string, unknown> = {}

  details.Band = item.database?.band.name ?? 'Not available'
  details['Born in'] = item.born_in ?? 'Not available'
  details.Birthday = item.database?.birthdate ?? 'Not available'
  details.Instruments =
    item.database?.instruments.map((instrument) => instrument.name).join(', ')
    ?? 'Not available'
  details['Former bands'] =
    item.former_bands.length > 0
      ? item.former_bands.join(', ')
      : 'Not available'

  return details
}

function ArtistData({
  value,
}: {
  value: unknown
}) {
  if (value === null || value === undefined) {
    return <Typography variant="body2" color="text.secondary">Not available</Typography>
  }

  if (typeof value === 'boolean') {
    return <Typography variant="body2">{value ? 'Yes' : 'No'}</Typography>
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? (
      <Stack spacing={1}>
        {value.map((item, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 1.5 }}>
            {typeof item === 'object' && item !== null ? (
              <ArtistData value={item} />
            ) : (
              <Typography variant="body2">{String(item)}</Typography>
            )}
          </Paper>
        ))}
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">No details available</Typography>
    )
  }

  if (typeof value === 'object') {
    const fields = Object.entries(value).filter(
      ([field]) =>
        field !== '__typename' &&
        field !== 'albums',
    )
    return fields.length > 0 ? (
      <Stack component="dl" spacing={1} sx={{ m: 0 }}>
        {fields.map(([field, fieldValue]) => (
          <Box key={field}>
            <Typography component="dt" variant="body2" sx={{ fontWeight: 600 }}>
              {formatFieldLabel(field)}
            </Typography>
            <Box component="dd" sx={{ m: 0, mt: 0.25, pl: 1.5 }}>
              {field === 'Band official website' &&
              typeof fieldValue === 'string' &&
              fieldValue !== 'Not available' ? (
                <Link
                  href={fieldValue}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {fieldValue}
                </Link>
              ) : (
                <ArtistData value={fieldValue} />
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">No details available</Typography>
    )
  }

  return (
    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
      {String(value)}
    </Typography>
  )
}

function ArtistPage({ id, name, searchQuery, onBack }: ArtistPageProps) {
  const decodedId = decodeURIComponent(id)
  const decodedName = decodeURIComponent(name)
  const artistQuery = searchQuery.trim() || decodedName
  const { data, loading, error } = useQuery<
    GetAllAboutArtistQuery,
    GetAllAboutArtistQueryVariables
  >(GetAllAboutArtistDocument, {
    variables: { name: artistQuery, limit: 100 },
  })
  const artists = (data?.getAllAboutArtist ?? []).filter((item) =>
    !decodedId || item.es_id === decodedId
  )
  const artist = artists[0]

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
        aria-labelledby="artist-title"
        sx={{ width: 'calc(100% - 40px)', maxWidth: 1080, mx: 'auto', py: { xs: 5, sm: 8 } }}
      >
        <Stack spacing={3}>
          <Typography
            component="h1"
            variant="h3"
            id="artist-title"
            sx={{ overflowWrap: 'anywhere', fontWeight: 700, letterSpacing: '-0.055em' }}
          >
            {artist?.name ?? decodedName ?? 'Artist details'}
          </Typography>

          {loading && (
            <Paper variant="outlined" sx={{ p: 4 }}>
              <Stack direction="row" spacing={1.5} role="status" sx={{ alignItems: 'center' }}>
                <CircularProgress size={20} />
                <Typography>Loading artist details…</Typography>
              </Stack>
            </Paper>
          )}
          {error && (
            <Alert severity="error" role="alert">
              <AlertTitle>Could not load artist details</AlertTitle>
              {error.message}
            </Alert>
          )}
          {!loading && !error && artists.length === 0 && (
            <Alert severity="info" role="status">
              No details were found for this artist.
            </Alert>
          )}

          {artists.map((item, index) => (
            <Paper key={`${item.es_id}-${index}`} component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
              <ArtistData value={cleanArtistDetails(item)} />
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default ArtistPage
