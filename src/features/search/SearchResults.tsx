import { useApolloClient, useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatActiveYears } from '../music-entrance/utils'
import { getMusicCategoryIcon } from '../music-entrance/categoryIcons'
import {
  GetAlbumDocument,
  type GetAlbumQuery,
  type GetAlbumQueryVariables,
  GetArtistDocument,
  type GetArtistQuery,
  type GetArtistQueryVariables,
  GetBandDocument,
  GetBandSongIdsDocument,
  type GetBandQuery,
  type GetBandQueryVariables,
  type GetBandSongIdsQuery,
  type GetBandSongIdsQueryVariables,
  GetGenreDocument,
  type GetGenreQuery,
  type GetGenreQueryVariables,
  GetSongDocument,
  type GetSongQuery,
  type GetSongQueryVariables,
} from '../../gql/operations'

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

function SearchResults({
  query,
  category,
  results,
  onBack,
}: SearchResultsProps) {
  const apolloClient = useApolloClient()
  const navigate = useNavigate()
  const [songNavigationLoading, setSongNavigationLoading] = useState(false)
  const [songNavigationError, setSongNavigationError] = useState<string | null>(null)
  const isAllSearch = category === 'All'
  const isBandSearch = category === 'Band'
  const isArtistSearch = category === 'Artist'
  const isAlbumSearch = category === 'Album'
  const isSongSearch = category === 'Song'
  const isGenreSearch = category === 'Genre'
  const {
    data: songData,
    loading: songLoading,
    error: songError,
  } = useQuery<GetSongQuery, GetSongQueryVariables>(GetSongDocument, {
    variables: { name: query },
    skip: !isAllSearch && !isSongSearch,
  })
  const {
    data: albumData,
    loading: albumLoading,
    error: albumError,
  } = useQuery<GetAlbumQuery, GetAlbumQueryVariables>(GetAlbumDocument, {
    variables: { name: query },
    skip: !isAllSearch && !isAlbumSearch,
  })
  const { data: bandData, loading: bandLoading, error: bandError } = useQuery<
    GetBandQuery,
    GetBandQueryVariables
  >(GetBandDocument, {
    variables: { name: query },
    skip: !isAllSearch && !isBandSearch,
  })
  const {
    data: artistData,
    loading: artistLoading,
    error: artistError,
  } = useQuery<GetArtistQuery, GetArtistQueryVariables>(
    GetArtistDocument,
    {
      variables: { name: query, limit: 100 },
      skip: !isAllSearch && !isArtistSearch,
    },
  )
  const {
    data: genreData,
    loading: genreLoading,
    error: genreError,
  } = useQuery<GetGenreQuery, GetGenreQueryVariables>(GetGenreDocument, {
    variables: { name: query },
    skip: !isAllSearch && !isGenreSearch,
  })

  async function openSongDetails(songName: string, bandName: string) {
    setSongNavigationLoading(true)
    setSongNavigationError(null)

    try {
      const bands = await apolloClient.query<GetBandQuery, GetBandQueryVariables>({
        query: GetBandDocument,
        variables: { name: bandName },
        fetchPolicy: 'network-only',
      })
      const band = bands.data?.getBand.find(
        (match) => match.name.toLowerCase() === bandName.toLowerCase(),
      )
      if (!band) {
        throw new Error(`Could not find ${bandName} in the band search results.`)
      }

      const bandDetails = await apolloClient.query<
        GetBandSongIdsQuery,
        GetBandSongIdsQueryVariables
      >({
        query: GetBandSongIdsDocument,
        variables: { id: band.id },
        fetchPolicy: 'network-only',
      })
      const song = bandDetails.data?.getAllAboutBand?.database?.albums
        .flatMap((album) => album.albumSongs)
        .map(({ song: albumSong }) => albumSong)
        .find((albumSong) => albumSong.title.trim().toLowerCase() === songName.trim().toLowerCase())

      if (!song) {
        throw new Error(`Could not find a database ID for ${songName}.`)
      }

      navigate(`/songs/${song.Id}`)
    } catch (error) {
      setSongNavigationError(
        error instanceof Error ? error.message : 'Could not load song details.',
      )
    } finally {
      setSongNavigationLoading(false)
    }
  }

  const bandResults: SearchResultItem[] = (bandData?.getBand ?? []).map((band) => ({
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
  const albumResults: SearchResultItem[] = (albumData?.getAlbum ?? []).map((album) => ({
    id: album.es_id,
    title: album.name,
    subtitle: album.band_name,
    category: 'Album',
  }))
  const songResults: SearchResultItem[] = (songData?.getSong ?? []).map((song) => ({
    id: song.es_id,
    title: song.name,
    subtitle: song.band_name,
    category: 'Song',
  }))
  const artistResults: SearchResultItem[] = (artistData?.getArtist ?? []).map((artist) => ({
    id: artist.es_id,
    title: artist.name,
    subtitle: artist.band_name,
    category: 'Artist',
    fields: [{ label: 'Born in', value: artist.born_in ?? 'Not available' }],
  }))
  const genreResults: SearchResultItem[] = (genreData?.getGenre ?? []).flatMap(
    ({ main_genre: mainGenre, genres }) =>
      genres.map((genre) => ({
        id: String(genre.Id),
        title: genre.name,
        subtitle: mainGenre ?? undefined,
        category: 'Genre',
      })),
  )

  const resultGroups = [
    {
      category: 'Band',
      results: sortSearchResults(bandResults, query),
      loading: bandLoading,
      error: bandError,
    },
    {
      category: 'Artist',
      results: sortSearchResults(artistResults, query),
      loading: artistLoading,
      error: artistError,
    },
    {
      category: 'Album',
      results: sortSearchResults(albumResults, query),
      loading: albumLoading,
      error: albumError,
    },
    {
      category: 'Song',
      results: sortSearchResults(songResults, query),
      loading: songLoading,
      error: songError,
    },
    {
      category: 'Genre',
      results: sortSearchResults(genreResults, query),
      loading: genreLoading,
      error: genreError,
    },
  ]
  const displayedResults: SearchResultItem[] = isBandSearch
    ? bandResults
    : isAlbumSearch
      ? albumResults
      : isSongSearch
        ? songResults
        : isArtistSearch
          ? artistResults
          : isGenreSearch
            ? genreResults
            : results

  const sortedResults = sortSearchResults(displayedResults, query)
  const isLoading =
    (isAlbumSearch && albumLoading) ||
    (isBandSearch && bandLoading) ||
    (isSongSearch && songLoading) ||
    (isArtistSearch && artistLoading) ||
    (isGenreSearch && genreLoading)
  const showFatalError =
    (isAlbumSearch && albumError) ||
    (isBandSearch && bandError) ||
    (isSongSearch && songError) ||
    (isArtistSearch && artistError && sortedResults.length === 0) ||
    (isGenreSearch && genreError)
  const errorMessage = isAlbumSearch
    ? albumError?.message
    : isBandSearch
      ? bandError?.message
      : isSongSearch
        ? songError?.message
        : isGenreSearch
          ? genreError?.message
          : artistError?.message
  const resultType = isAlbumSearch
    ? 'album'
    : isBandSearch
      ? 'band'
      : isSongSearch
        ? 'song'
        : isGenreSearch
          ? 'genre'
          : 'artist'
  const totalAllResults = resultGroups.reduce((total, group) => total + group.results.length, 0)

  function renderResultsList(resultsToRender: SearchResultItem[]) {
    return (
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
        {resultsToRender.map((result, index) => {
          const resultCategory = result.category ?? category
          const rowContents = (
            <>
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
                {getMusicCategoryIcon(resultCategory)}
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
                label={resultCategory}
                size="small"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              />
              <Box component="span" aria-hidden="true" sx={{ color: 'text.disabled' }}>
                <i className="fa-solid fa-chevron-right" />
              </Box>
            </>
          )
          const rowSx = {
            gap: { xs: 1.5, sm: 2 },
            minHeight: 82,
            py: 1.5,
            px: { xs: 1.5, sm: 2.5 },
            alignItems: 'center',
            borderBottom: index < resultsToRender.length - 1 ? 1 : 0,
            borderColor: 'divider',
          }

          if (resultCategory === 'Band' || resultCategory === 'Album' ||
            resultCategory === 'Genre' || resultCategory === 'Artist' ||
            resultCategory === 'Song') {
            return (
              <ListItemButton
                component="li"
                key={`${resultCategory}-${result.id}`}
                onClick={() => {
                  if (resultCategory === 'Band') {
                    navigate(`/bands/${encodeURIComponent(result.id)}`)
                  } else if (resultCategory === 'Album') {
                    navigate(`/albums/${encodeURIComponent(result.id)}`)
                  } else if (resultCategory === 'Genre') {
                    navigate(`/genres/${encodeURIComponent(result.id)}`)
                  } else if (resultCategory === 'Artist') {
                    navigate(`/artists/${encodeURIComponent(result.id)}`, {
                      state: {
                        searchQuery: query,
                        artistName: result.title,
                      },
                    })
                  } else {
                    void openSongDetails(result.title, result.subtitle ?? 'Unknown band')
                  }
                }}
                aria-label={`View ${result.title} details`}
                disabled={resultCategory === 'Song' && songNavigationLoading}
                sx={rowSx}
              >
                {rowContents}
              </ListItemButton>
            )
          }

          return (
            <ListItem component="li" key={`${resultCategory}-${result.id}`} sx={rowSx}>
              {rowContents}
            </ListItem>
          )
        })}
      </List>
    )
  }

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
          {(isAllSearch ? totalAllResults : sortedResults.length) > 0 && (
            <Typography component="span" variant="body2" color="text.secondary">
              {isAllSearch ? totalAllResults : sortedResults.length}{' '}
              {(isAllSearch ? totalAllResults : sortedResults.length) === 1 ? 'result' : 'results'}
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
                Searching {resultType}s…
              </Typography>
            </Stack>
          </Paper>
        ) : songNavigationLoading ? (
          <Paper variant="outlined" sx={{ p: 4 }}>
            <Stack
              direction="row"
              spacing={1.5}
              role="status"
              sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <CircularProgress size={20} />
              <Typography component="strong" variant="body1">
                Opening song details…
              </Typography>
            </Stack>
          </Paper>
        ) : songNavigationError ? (
          <Alert severity="error" role="alert">
            <AlertTitle>Could not open song details</AlertTitle>
            {songNavigationError}
          </Alert>
        ) : isAllSearch ? (
          resultGroups.some((group) => group.loading || group.error || group.results.length > 0) ? (
            <Stack spacing={2}>
              {resultGroups
                .filter((group) => group.loading || group.error || group.results.length > 0)
                .map((group) => {
                  const pluralCategory =
                    group.category === 'Genre'
                      ? 'genres'
                      : `${group.category.toLowerCase()}s`
                  return (
                    <Paper
                      key={group.category}
                      component="section"
                      aria-label={`${group.category} results`}
                      variant="outlined"
                      sx={{ p: { xs: 1.5, sm: 2 } }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
                      >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Box
                            aria-hidden="true"
                            sx={{ display: 'inline-flex', color: 'primary.main' }}
                          >
                            {getMusicCategoryIcon(group.category)}
                          </Box>
                          <Typography component="h3" variant="h6">
                            {group.category}
                          </Typography>
                        </Stack>
                        {group.results.length > 0 && (
                          <Typography component="span" variant="body2" color="text.secondary">
                            {group.results.length}{' '}
                            {group.results.length === 1 ? 'result' : 'results'}
                          </Typography>
                        )}
                      </Stack>
                      {group.loading ? (
                        <Stack
                          direction="row"
                          spacing={1.5}
                          role="status"
                          sx={{ alignItems: 'center', justifyContent: 'center', py: 3 }}
                        >
                          <CircularProgress size={20} />
                          <Typography component="span" variant="body2">
                            Searching {pluralCategory}…
                          </Typography>
                        </Stack>
                      ) : group.error ? (
                        <Alert severity="error" role="alert">
                          Could not load {group.category.toLowerCase()} results: {group.error.message}
                        </Alert>
                      ) : (
                        renderResultsList(group.results)
                      )}
                    </Paper>
                  )
                })}
            </Stack>
          ) : (
            <Paper variant="outlined" sx={{ p: 4 }}>
              <Typography
                component="p"
                variant="body2"
                color="text.secondary"
                sx={{ m: 0, textAlign: 'center' }}
              >
                No results matched this search.
              </Typography>
            </Paper>
          )
        ) : showFatalError ? (
          <Alert severity="error" role="alert">
            <AlertTitle>
              Could not load {resultType} results
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
            {renderResultsList(sortedResults)}
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
                {isAlbumSearch
                  ? 'No albums matched this search.'
                  : isBandSearch
                    ? 'No bands matched this search.'
                    : isSongSearch
                      ? 'No songs matched this search.'
                      : isArtistSearch
                        ? 'No artists matched this search.'
                        : isGenreSearch
                          ? 'No genres matched this search.'
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
