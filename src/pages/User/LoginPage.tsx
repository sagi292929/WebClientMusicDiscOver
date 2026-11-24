import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import {
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
} from '../../gql/operations'

type LoginPageProps = {
  onLoginSuccess: (userName: string) => void
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false)
  const navigate = useNavigate()
  const [login, { loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmissionError(null)
    try {
      const result = await login({
        variables: {
          name: user.trim(),
          password,
        },
      })
      if (result.data?.login) {
        onLoginSuccess(user.trim())
        setIsWelcomeDialogOpen(true)
      } else {
        setSubmissionError('Sign in failed. Check your user and password.')
      }
    } catch (mutationError) {
      setSubmissionError(
        mutationError instanceof Error ? mutationError.message : 'Sign in failed.',
      )
    }
  }

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
        component="form"
        onSubmit={handleSubmit}
        spacing={2.5}
        sx={{
          width: '100%',
          maxWidth: 400,
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
        <TextField
          label="User"
          name="user"
          autoComplete="username"
          value={user}
          onChange={(event) => setUser(event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
        />
        {(submissionError || error) && (
          <Alert severity="error" role="alert">
            {submissionError ?? error?.message}
          </Alert>
        )}
        <Button type="submit" variant="contained" disabled={!user.trim() || !password || loading}>
          Confirm
        </Button>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Stack>
      <Dialog
        open={isWelcomeDialogOpen}
        onClose={() => navigate('/')}
        aria-labelledby="login-welcome-title"
      >
        <DialogTitle id="login-welcome-title">Welcome</DialogTitle>
        <DialogContent>Welcome, {user}!</DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => navigate('/')} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LoginPage
