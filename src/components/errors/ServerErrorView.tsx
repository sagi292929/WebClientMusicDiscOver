import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type ServerErrorViewProps = {
  isOffline: boolean
  isRetrying: boolean
  retryError: string | null
  onRetry: () => void
}

export function ServerErrorView({
  isOffline,
  isRetrying,
  retryError,
  onRetry,
}: ServerErrorViewProps) {
  return (
    <Box
      component="main"
      role="alert"
      aria-live="assertive"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper
        variant="outlined"
        sx={{ width: '100%', maxWidth: 480, p: { xs: 3, sm: 4 }, mx: 'auto' }}
      >
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Typography component="h1" variant="h4">
            {isOffline ? "You're offline" : 'Connection lost'}
          </Typography>
          <Typography color="text.secondary">
            {retryError ??
              (isOffline
                ? 'Check your internet connection, then try again.'
                : 'We cannot reach the server right now. Please try again.')}
          </Typography>
          <Button type="button" variant="contained" onClick={onRetry} disabled={isRetrying}>
            {isRetrying ? 'Retrying...' : 'Try again'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
