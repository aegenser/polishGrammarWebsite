import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, IconButton, FormGroup, Checkbox, FormControlLabel, FormLabel } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

const NOUNS = [
  {
    mianownik: 'call 1',
    biernik: 'response'
  },
  {
    mianownik: 'call 2',
    biernik: 'response'
  },
  {
    mianownik: 'call 3',
    biernik: 'response'
  }
]

function App() {
  const [inPracticeMode, setInPracticeMode] = useState(false);
  const [isDecline, setIsDecline] = useState(true);
  const [plurality, setPlurality] = useState('both');
  const [gender, setGender] = React.useState({
    masculine: true,
    feminine: true,
    neuter: true
  });
  const [practiceInput, setPracticeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [call, setCall] = useState(NOUNS[0]);

  function handleEnter() {
    if (practiceInput.length == 0 || practiceInput !== call.biernik) {
      setErrorMessage('Incorrect');
      setMessage('');
      setPracticeInput('');
    } else {
      setErrorMessage('');
      setMessage('Nice Job!');
      setCall(NOUNS[Math.floor(Math.random() * NOUNS.length)]);
      setPracticeInput('');
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEnter();
    }
  }

  if (!inPracticeMode) {
    return (
      <div className="App">
        <Box m={2}>
          <Box m='auto' align='center'>
            <Grid container style={{maxWidth: '1000px'}} spacing={2} alignContent='left'>
              <Grid container item xs={12}>
                <Typography variant='h3'> Polish Grammar Practice </Typography>
              </Grid>
              <Grid container item xs={12} alignConent='left'>
                <FormGroup>
                  <FormLabel component='legend'> What Genders? </FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.masculine}
                          onChange={(event) => setGender({ ... gender, masculine: event.target.checked })}
                          color="primary"
                        />
                      }
                      label="Masculine"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.feminine}
                          onChange={(event) => setGender({ ... gender, feminine: event.target.checked })}
                          color="primary"
                        />
                      }
                      label="Feminine"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.neuter}
                          onChange={(event) => setGender({ ... gender, neuter: event.target.checked })}
                          color="primary"
                        />
                      }
                      label="Neuter"
                    />
                  </FormGroup>
                </FormGroup>
              </Grid>
              <Grid container item xs={12}>
                <Button onClick={() => setInPracticeMode(true)}>
                  Begin Practice!
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    )
  }

  return (
    <div className="App">
      <Box m={2}>
        <Box m='auto' align='center'>
          <Grid container style={{maxWidth: '1000px'}} spacing={2}>
            <Grid container item xs={12} alignContent='left'>
              <IconButton onClick={() => setInPracticeMode(false)}>
                <ArrowBack/>
              </IconButton>
            </Grid>
            <Grid container item xs={12}>
              <Typography variant='h6'> What is {call.mianownik}? </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Typography variant='subtitle'> {message} </Typography>
              <Typography color='error' variant='subtitle'> {errorMessage} </Typography>
            </Grid>
            <Grid container item xs={10}>
              <TextField variant='outlined' onKeyDown={handleKeyDown} inputRef={input => input && input.focus()} value={practiceInput} label="Answer: " multiline={false} fullWidth={true} onChange={function(value) {
              if (value.target.value != null) {
                setPracticeInput(value.target.value);
              } else {
                setPracticeInput("");
              }
              }}>
            </TextField>
            </Grid>
            <Grid container item xs={2}>
              <Button onClick={() => handleEnter()}>
                Enter
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default App;
