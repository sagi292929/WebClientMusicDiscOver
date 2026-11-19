import { useQuery } from '@apollo/client/react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatActiveYears } from '../components/MusicEntrance/utils'
import {
  GetArtistAndAboutDocument,
  type GetArtistAndAboutQuery,
  type GetArtistAndAboutQueryVariables,
  GetBandDocument,
  type GetBandQuery,
  type GetBandQueryVariables,
} from '../gql/operations'

const artistResultFieldOrder = ['Name', 'Born in', 'Band', 'Instruments'] as const

function formatInstrumentName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

export type SearchResultItem = {
  id: string
  title: string
  subtitle?: string
  details?: string
  category?: string
  fields?: Array<{ label: string; value: string }>
}

function sortSearchResults(
  results: SearchResultItem[],
  searchText: string,
): SearchResultItem[] {
  const normalizedSearchText = searchText.trim().toLowerCase()
  const secondWord = normalizedSearchText.split(/\s+/)[1]
  if (!normalizedSearchText) {
    return results
  }

  return results
    .map((result, index) => {
      const title = result.title.trim().toLowerCase()
      const rank = title.startsWith(normalizedSearchText)
        ? 0
        : secondWord && title.startsWith(secondWord)
          ? 1
          : 2
      return { result, index, rank }
    })
    .sort((first, second) => first.rank - second.rank || first.index - second.index)
    .map(({ result }) => result)
}

type SearchResultsProps = {
  query: string
  category: string
  results: SearchResultItem[]
  onBack: () => void
}

function SearchResults({ query, category, results, onBack }: SearchResultsProps) {
  const isBandSearch = category === 'Band'
  const isArtistSearch = category === 'Artist'
  const { data: bandData, loading: bandLoading, error: bandError } = useQuery<
    GetBandQuery,
    GetBandQueryVariables
  >(GetBandDocument, {
    variables: { name: query },
    skip: !isBandSearch,
  })
  const {
    data: artistData,
    loading: artistLoading,
    error: artistError,
  } = useQuery<GetArtistAndAboutQuery, GetArtistAndAboutQueryVariables>(
    GetArtistAndAboutDocument,
    {
      variables: { name: query },
      skip: !isArtistSearch,
      errorPolicy: 'all',
    },
  )

  const artistDetailsById = new Map(
    (artistData?.getAllAboutArtist ?? []).map((artist) => [artist.es_id, artist]),
  )
  const artistMatches = new Map(
    (artistData?.getArtist ?? []).map((artist) => [artist.es_id, artist]),
  )
  for (const artist of artistDetailsById.values()) {
    if (!artistMatches.has(artist.es_id)) {
      artistMatches.set(artist.es_id, artist)
    }
  }

  const displayedResults: SearchResultItem[] = isBandSearch
    ? (bandData?.getBand ?? []).map((band) => ({
        id: band.id,
        title: band.name,
        category: 'Band',
        fields: [
          { label: 'ID', value: band.id },
          {
            label: 'Active years',
            value: band.active_years.length > 0
              ? formatActiveYears(band.active_years)
              : 'Not available',
          },
        ],
      }))
    : isArtistSearch
      ? [...artistMatches.values()].map((artist) => {
          const details = artistDetailsById.get(artist.es_id)
          const database = details?.database
          const artistValues = {
            Name: artist.name,
            'Born in': artist.born_in ?? database?.birthdate ?? 'Not available',
            Band: database?.band.name ?? 'Not available',
            Instruments: database?.instruments
              .map(({ name }) => formatInstrumentName(name))
              .join(', ')
              || 'Not available',
          }
          const [titleField, ...fields] = artistResultFieldOrder.map((label) => ({
            label,
            value: artistValues[label],
          }))

          return {
            id: artist.es_id,
            title: titleField.value,
            category: 'Artist',
            fields,
          }
        })
      : results

  const sortedResults = sortSearchResults(displayedResults, query)
  const isLoading = (isBandSearch && bandLoading) || (isArtistSearch && artistLoading)
  const showFatalError =
    (isBandSearch && bandError) || (isArtistSearch && artistError && sortedResults.length === 0)
  const errorMessage = isBandSearch ? bandError?.message : artistError?.message

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage:
          'radial-gradient(ellipse at 50% -35%, rgb(198 255 0 / 8%), transparent 58%)',
      }}
    >
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          py: 2,
          px: { xs: 2.5, sm: 5, md: 9 },
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
        <Button
          type="button"
          variant="outlined"
          onClick={onBack}
          startIcon={<i className="fa-solid fa-arrow-left" aria-hidden="true" />}
        >
          New search
        </Button>
      </Box>

      <Box
        component="section"
        aria-labelledby="search-results-title"
        sx={{
          width: 'calc(100% - 40px)',
          maxWidth: 1080,
          mx: 'auto',
          py: { xs: 5, sm: 8 },
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          id="search-results-title"
          gutterBottom
          sx={{
            overflowWrap: 'anywhere',
            fontWeight: 700,
            letterSpacing: '-0.055em',
            lineHeight: 1.08,
          }}
        >
          Search results for: &ldquo;{query}&rdquo;
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
          <Typography component="span" variant="body2" color="text.secondary">
            Category
          </Typography>
          <Chip label={category} size="small" variant="outlined" />
        </Stack>

        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5, mt: 7 }}
        >
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
            Results
          </Typography>
          {sortedResults.length > 0 && (
            <Typography component="span" variant="body2" color="text.secondary">
              {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'}
            </Typography>
          )}
        </Stack>

        {isLoading ? (
          <Paper variant="outlined" sx={{ p: 4 }}>
            <Stack
              direction="row"
              spacing={1.5}
              role="status"
              sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <CircularProgress size={20} />
              <Typography component="strong" variant="body1">
                {isBandSearch ? 'Searching bands…' : 'Searching artists…'}
              </Typography>
            </Stack>
          </Paper>
        ) : showFatalError ? (
          <Alert severity="error" role="alert">
            <AlertTitle>
              {isBandSearch ? 'Could not load band results' : 'Could not load artist results'}
            </AlertTitle>
            {errorMessage}
          </Alert>
        ) : sortedResults.length > 0 ? (
          <Stack spacing={2}>
            {isArtistSearch && artistError && (
              <Alert severity="warning" role="alert">
                <AlertTitle>Some artist details could not be loaded</AlertTitle>
                {artistError.message}
              </Alert>
            )}
            <List
              component="ul"
              disablePadding
              sx={{
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              {sortedResults.map((result, index) => (
                <ListItem
                  component="li"
                  key={result.id}
                  divider={index < sortedResults.length - 1}
                  sx={{
                    gap: { xs: 1.5, sm: 2 },
                    minHeight: 82,
                    py: 1.5,
                    px: { xs: 1.5, sm: 2.5 },
                    alignItems: 'center',
                    transition: 'background-color 150ms ease',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontVariantNumeric: 'tabular-nums', minWidth: { xs: 'auto', sm: 3 } }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      borderRadius: 1,
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <i className="fa-solid fa-music" />
                  </Box>
                  <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                    <Typography component="strong" variant="subtitle1" noWrap>
                      {result.title}
                    </Typography>
                    {result.subtitle && (
                      <Typography component="span" variant="body2" color="text.secondary" noWrap>
                        {result.subtitle}
                      </Typography>
                    )}
                    {result.fields?.map((field) => (
                      <Typography
                        key={field.label}
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        <Box component="strong" sx={{ color: 'text.primary' }}>
                          {field.label}:
                        </Box>{' '}
                        {field.value}
                      </Typography>
                    ))}
                  </Stack>
                  {result.details && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                      {result.details}
                    </Typography>
                  )}
                  <Chip
                    label={result.category ?? category}
                    size="small"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  />
                  <Box component="span" aria-hidden="true" sx={{ color: 'text.disabled' }}>
                    <i className="fa-solid fa-chevron-right" />
                  </Box>
                </ListItem>
              ))}
            </List>
          </Stack>
        ) : (
          <Paper variant="outlined" sx={{ p: 4 }}>
            <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
              <Box aria-hidden="true" sx={{ color: 'text.secondary', fontSize: '1.25rem' }}>
                <i className="fa-solid fa-music" />
              </Box>
              <Typography component="strong" variant="subtitle1">
                Results will appear here
              </Typography>
              <Typography component="span" variant="body2" color="text.secondary">
                {isBandSearch
                  ? 'No bands matched this search.'
                  : isArtistSearch
                    ? 'No artists matched this search.'
                    : 'Search is ready to connect to the music catalog.'}
              </Typography>
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default SearchResults
