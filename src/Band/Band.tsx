import { useQuery } from '@apollo/client/react'
import type { ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatActiveYears } from '../components/MusicEntrance/utils'
import {
  GetAllAboutBandDocument,
  type GetAllAboutBandQuery,
  type GetAllAboutBandQueryVariables,
} from '../gql/operations'

type BandPageProps = {
  id: string
  name: string
  onBack: () => void
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 650 }}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Paper>
  )
}

function DetailValue({ label, value }: { label: string; value: string | number }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
      <Box component="strong" sx={{ color: 'text.primary' }}>
        {label}:
      </Box>{' '}
      {value}
    </Typography>
  )
}

function BandPage({ id, name, onBack }: BandPageProps) {
  const { data, loading, error } = useQuery<
    GetAllAboutBandQuery,
    GetAllAboutBandQueryVariables
  >(GetAllAboutBandDocument, { variables: { id } })
  const band = data?.getAllAboutBand

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
        aria-labelledby="band-title"
        sx={{
          width: 'calc(100% - 40px)',
          maxWidth: 1080,
          mx: 'auto',
          py: { xs: 5, sm: 8 },
        }}
      >
        <Stack spacing={3}>
          <Typography
            component="h1"
            variant="h3"
            id="band-title"
            sx={{
              overflowWrap: 'anywhere',
              fontWeight: 700,
              letterSpacing: '-0.055em',
              lineHeight: 1.08,
            }}
          >
            {band?.name ?? name}
          </Typography>

          {loading && (
            <Paper variant="outlined" sx={{ p: 4 }}>
              <Stack direction="row" spacing={1.5} role="status" sx={{ alignItems: 'center' }}>
                <CircularProgress size={20} />
                <Typography>Loading band details…</Typography>
              </Stack>
            </Paper>
          )}
          {error && (
            <Alert severity="error" role="alert">
              <AlertTitle>Could not load band details</AlertTitle>
              {error.message}
            </Alert>
          )}
          {!loading && !error && !band && (
            <Alert severity="info" role="status">
              No details were found for this band.
            </Alert>
          )}

          {band && (
            <>
              <DetailSection title="Overview">
                <Stack spacing={1}>
                  <DetailValue
                    label="Active years"
                    value={formatActiveYears(band.active_years) || 'Not available'}
                  />
                  <DetailValue
                    label="Genres"
                    value={band.genres.join(', ') || 'Not available'}
                  />
                  <DetailValue label="Added" value={band.inserted_at ?? 'Not available'} />
                </Stack>
              </DetailSection>

              {band.members.length > 0 && (
                <DetailSection title={`Members (${band.members.length})`}>
                  <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {band.members.map((member) => (
                      <Chip key={member.id} label={member.name} variant="outlined" />
                    ))}
                  </Stack>
                </DetailSection>
              )}

              {band.albums.length > 0 && (
                <DetailSection title={`Albums (${band.albums.length})`}>
                  <Stack spacing={1.5}>
                    {band.albums.map((album) => (
                      <Paper key={album.id} variant="outlined" sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                          <Box
                            aria-hidden="true"
                            sx={{
                              width: 48,
                              height: 48,
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
                          <Stack spacing={0.5}>
                            <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {album.name}
                            </Typography>
                            <DetailValue label="Album ID" value={album.id} />
                            <DetailValue label="Year" value={album.year ?? 'Not available'} />
                            <DetailValue
                              label="Length"
                              value={album.length_minutes ?? 'Not available'}
                            />
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </DetailSection>
              )}

              {band.songs_hits.length > 0 && (
                <DetailSection title={`Songs and hits (${band.songs_hits.length})`}>
                  <Stack spacing={1.5}>
                    {band.songs_hits.map((song) => (
                      <Paper key={`${song.title}-${song.year ?? ''}`} variant="outlined" sx={{ p: 2 }}>
                        <Stack spacing={0.5}>
                          <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {song.title}
                          </Typography>
                          <DetailValue label="Year" value={song.year ?? 'Not available'} />
                          <DetailValue
                            label="Achievement"
                            value={song.achievement ?? 'Not available'}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Studio albums:{' '}
                            {song.discography?.studio_albums.map(({ name: albumName }) => albumName).join(', ')
                              || 'Not available'}
                          </Typography>
                          {song.discography?.studio_albums.map((album) => (
                            <DetailValue
                              key={album.id}
                              label={`${album.name} details`}
                              value={`${album.year ?? 'Year unavailable'} · ${album.length_minutes ?? 'Length unavailable'}`}
                            />
                          ))}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </DetailSection>
              )}

              {band.database && (
                <DetailSection title="About the band">
                  <Stack spacing={2}>
                    <Stack spacing={0.5}>
                        <DetailValue label="Origin" value={band.database.origin || 'Not available'} />
                        <DetailValue
                          label="Official website"
                        value={band.database.officialWebsite || 'Not available'}
                      />
                      <DetailValue
                        label="Rock and Roll Hall of Fame induction"
                        value={band.database.rockAndRollHallOfFameInduction ?? 'Not available'}
                      />
                    </Stack>
                    <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Artists
                    </Typography>
                    {band.database.artists.length ? (
                      band.database.artists.map((artist) => (
                        <Paper key={artist.es_id} variant="outlined" sx={{ p: 2 }}>
                          <Stack spacing={0.5}>
                            <Typography sx={{ fontWeight: 600 }}>{artist.name}</Typography>
                            <DetailValue
                              label="Birth date"
                              value={artist.birthdate ?? 'Not available'}
                            />
                            <DetailValue
                              label="Instruments"
                              value={artist.artistInstruments
                                .map(({ instrument }) => `${instrument.name} (${instrument.Type})`)
                                .join(', ') || 'Not available'}
                            />
                          </Stack>
                        </Paper>
                      ))
                    ) : (
                      <Typography color="text.secondary">No artists listed.</Typography>
                    )}
                    <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Albums
                    </Typography>
                    {band.database.albums.length ? (
                      band.database.albums.map((album) => (
                        <Paper key={`${album.title}-${album.year}`} variant="outlined" sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                            <Box
                              aria-hidden="true"
                              sx={{
                                width: 48,
                                height: 48,
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
                            <Stack spacing={0.5}>
                              <Typography sx={{ fontWeight: 600 }}>{album.title}</Typography>
                              <DetailValue label="Year" value={album.year} />
                              <DetailValue label="Length" value={album.lengthMinutes} />
                            </Stack>
                          </Stack>
                        </Paper>
                      ))
                    ) : (
                      <Typography color="text.secondary">No database albums listed.</Typography>
                    )}
                  </Stack>
                </DetailSection>
              )}

              {band.elasticsearch && (
                <DetailSection title="Elasticsearch data">
                  <Stack spacing={1}>
                    <DetailValue label="Name" value={band.elasticsearch.name} />
                    <DetailValue
                      label="Active years"
                      value={formatActiveYears(band.elasticsearch.active_years) || 'Not available'}
                    />
                    <DetailValue
                      label="Genres"
                      value={band.elasticsearch.genres.join(', ') || 'Not available'}
                    />
                    <DetailValue
                      label="Added"
                      value={band.elasticsearch.inserted_at ?? 'Not available'}
                    />
                  </Stack>
                </DetailSection>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default BandPage
