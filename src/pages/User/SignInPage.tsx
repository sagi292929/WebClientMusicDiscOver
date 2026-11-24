import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

function SignInPage() {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          width: '100%',
          maxWidth: 400,
          alignItems: 'stretch',
          p: { xs: 3, sm: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
          Sign in
        </Typography>
        <Button component={RouterLink} to="/create-account" variant="contained">
          Create an account
        </Button>
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          or
        </Typography>
        <Button component={RouterLink} to="/login" variant="outlined">
          Sign in to an existing account
        </Button>
      </Stack>
    </Box>
  )
}

export default SignInPage
