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
  GetAllAboutAlbumDocument,
  type GetAllAboutAlbumQuery,
  type GetAllAboutAlbumQueryVariables,
} from '../../gql/operations'

type AlbumPageProps = {
  id: string
  onBack: () => void
}

function getStringField(value: unknown, fieldName: string): string | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined
  }

  const field = Object.entries(value).find(([name]) => name === fieldName)?.[1]
  return typeof field === 'string' ? field : undefined
}

function formatFieldLabel(field: string): string {
  const label = field
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function AlbumData({
  value,
  omittedFields = [],
}: {
  value: unknown
  omittedFields?: string[]
}) {
  if (value === null || value === undefined) {
    return <Typography variant="body2" color="text.secondary">Not available</Typography>
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? (
      <Stack spacing={1}>
        {value.map((item, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 1.5 }}>
            <AlbumData value={item} />
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
        !omittedFields.includes(field),
    )
    return fields.length > 0 ? (
      <Stack component="dl" spacing={1} sx={{ m: 0 }}>
        {fields.map(([field, fieldValue]) => (
          <Box key={field}>
            <Typography component="dt" variant="body2" sx={{ fontWeight: 600 }}>
              {formatFieldLabel(field)}
            </Typography>
            <Box component="dd" sx={{ m: 0, mt: 0.25, pl: 1.5 }}>
              <AlbumData value={fieldValue} />
            </Box>
          </Box>
        ))}
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">No details available</Typography>
    )
  }

  if (typeof value === 'boolean') {
    return <Typography variant="body2">{value ? 'Yes' : 'No'}</Typography>
  }

  return (
    <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
      {String(value)}
    </Typography>
  )
}

function AlbumPage({ id, onBack }: AlbumPageProps) {
  const { data, loading, error } = useQuery<
    GetAllAboutAlbumQuery,
    GetAllAboutAlbumQueryVariables
  >(GetAllAboutAlbumDocument, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
  })
  const album = data?.getAllAboutAlbum
  const name = getStringField(album?.elasticsearch, 'name') ?? 'Album details'
  const bandName = getStringField(album?.elasticsearch, 'band_name')

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
        aria-labelledby="album-title"
        sx={{ width: 'calc(100% - 40px)', maxWidth: 1080, mx: 'auto', py: { xs: 5, sm: 8 } }}
      >
        <Typography
          component="h1"
          variant="h3"
          id="album-title"
          sx={{ overflowWrap: 'anywhere', fontWeight: 700, letterSpacing: '-0.055em' }}
        >
          {name}
        </Typography>
        {bandName && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
            {bandName}
          </Typography>
        )}

        {!id ? (
          <Alert severity="error" role="alert">
            <AlertTitle>Could not load album details</AlertTitle>
            The album URL must contain an album ID.
          </Alert>
        ) : loading ? (
          <Paper variant="outlined" sx={{ p: 4 }}>
            <Stack
              direction="row"
              spacing={1.5}
              role="status"
              sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <CircularProgress size={20} />
              <Typography component="strong" variant="body1">
                Loading album details…
              </Typography>
            </Stack>
          </Paper>
        ) : error ? (
          <Alert severity="error" role="alert">
            <AlertTitle>Could not load album details</AlertTitle>
            {error.message}
          </Alert>
        ) : album ? (
          <Stack spacing={2}>
            <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
              <AlbumData value={album.database} omittedFields={['Id', 'BandId']} />
            </Paper>
            <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
              <AlbumData value={album.elasticsearch} omittedFields={['name']} />
            </Paper>
          </Stack>
        ) : (
          <Alert severity="info">No album details were found.</Alert>
        )}
      </Box>
    </Box>
  )
}

export default AlbumPage
