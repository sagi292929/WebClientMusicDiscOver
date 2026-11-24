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
  SaveUserDocument,
  type SaveUserMutation,
  type SaveUserMutationVariables,
} from '../../gql/operations'

function CreateAccountPage() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const navigate = useNavigate()
  const [saveUser, { loading, error }] = useMutation<
    SaveUserMutation,
    SaveUserMutationVariables
  >(SaveUserDocument, {
    onCompleted: () => setIsSuccessDialogOpen(true),
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmissionError(null)
    try {
      await saveUser({
        variables: {
          name: user.trim(),
          password,
        },
      })
    } catch (mutationError) {
      setSubmissionError(
        mutationError instanceof Error ? mutationError.message : 'Account creation failed.',
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
          Create an account
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
        />
        {(submissionError || error) && (
          <Alert severity="error" role="alert">
            Could not create account: {submissionError ?? error?.message}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={!user.trim() || !password || loading}
        >
          Apply
        </Button>
      </Stack>
      <Dialog
        open={isSuccessDialogOpen}
        onClose={() => navigate('/')}
        aria-labelledby="create-account-success-title"
      >
        <DialogTitle id="create-account-success-title">Account created</DialogTitle>
        <DialogContent>
          create user succeed.
          <br />
          please sign in with your user
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => navigate('/')} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CreateAccountPage
