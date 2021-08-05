import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, IconButton, FormGroup, Radio, Checkbox, FormControlLabel, FormLabel } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

const NOUNS = require('./nouns.json');
const ADJECTIVES = require('./adjectives.json');
const VIRILITIES = ['virile', 'nonvirile'];
const PLURALITIES = ['singular', 'plural'];

console.log(NOUNS);

function App() {
  const [inPracticeMode, setInPracticeMode] = useState(false);
  const [isDecline, setIsDecline] = useState(true);
  const [withAdjectives, setWithAdjectives] = useState(true);
  const [plurality, setPlurality] = useState('both');
  const [virility, setVirility] = useState('both');
  const [gender, setGender] = React.useState({
    masculine: true,
    feminine: true,
    neuter: true
  });
  const [cases, setCases] = React.useState({
    dopełniacz: true,
    celownik: true,
    biernik: true,
    narzędnik: true,
    miejscownik: true,
    wołacz: false
  });
  const [practiceInput, setPracticeInput] = useState('');
  const [genderError, setGenderError] = useState('');
  const [caseError, setCaseError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [callNoun, setCallNoun] = useState(null);
  const [callAdjective, setCallAdjective] = useState(null);
  const [callGender, setCallGender] = useState('');
  const [callVirility, setCallVirility] = useState('');
  const [callCase, setCallCase] = useState('');
  const [callPlurality, setCallPlurality] = useState('');

  function setGenderWithError(newGender) {
    setGender(newGender);
    if (newGender.masculine || newGender.feminine || newGender.neuter) {
      setGenderError('');
    } else {
      setGenderError('You must select at least one gender');
    }
  }

  function setCasesWithError(newCases) {
    setCases(newCases);
    if (newCases.dopełniacz || newCases.celownik || newCases.biernik ||
        newCases.narzędnik || newCases.miejscownik || newCases.wołacz) {
      setCaseError('');
    } else {
      setCaseError('You must select at least one case');
    }
  }

  function generateCall() {
    var wordSet;
    var genders = ['masculine', 'feminine', 'neuter'].filter(g => gender[g]);
    var randGender = genders[Math.floor(Math.random() * genders.length)];
    setCallGender(randGender);
    if (randGender === 'masculine') {
      if (virility === 'both' || !isDecline || plurality === 'singular') {
        var randVirility = VIRILITIES[Math.floor(Math.random() * VIRILITIES.length)];
        wordSet = NOUNS[randGender][randVirility];
        setCallVirility(randVirility);
      } else {
        wordSet = NOUNS[randGender][virility];
        setCallVirility(virility);
      }
    }
    else {
      setCallVirility('nonvirile');
      wordSet = NOUNS[randGender];
    }
    setCallNoun(wordSet[Math.floor(Math.random() * wordSet.length)]);
    if (isDecline) {
      if (plurality === 'both') {
        setCallPlurality(PLURALITIES[Math.floor(Math.random() * PLURALITIES.length)])
      } else {
        setCallPlurality(plurality)
      }
      var randCase = ['dopełniacz', 'celownik', 'biernik', 'narzędnik', 'miejscownik', 'wołacz'].filter(d => cases[d]);
      setCallCase(randCase[Math.floor(Math.random() * randCase.length)]);
    } else {
      setCallPlurality('singular');
    }


    if (withAdjectives) {
      setCallAdjective(ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]);
    }
    else {
      setCallAdjective(null);
    }
  }

  function getAdjectiveForQuestion() {
    if (callPlurality === 'plural') {
      return callAdjective[callVirility].mianownik;
    }
    else {
      return callAdjective[callGender].mianownik;
    }
  }

  function getResponse() {
    var response;

    if (isDecline) {
      response = callNoun[callPlurality][callCase];
    } else {
      response = callNoun.plural.mianownik;
    }

    if (callAdjective !== null) {
      if (isDecline) {
        if (callPlurality === 'plural') {
          response = callAdjective[callVirility][callCase] + ' ' + response;;
        }
        else {
          if (callCase === 'biernik' && callGender === 'masculine' && !callNoun.animate) {
            response = callAdjective.masc_inan_biernik + ' ' + response;
          } else {
            response = callAdjective[callGender][callCase] + ' ' + response;
          }
        }
      } else {
        response = callAdjective[callVirility].mianownik + ' ' + response;
      }
    }

    return response;
  }

  function showAnswer() {
    setMessage(getResponse());
    setErrorMessage('');
  }

  function handleEnter() {
    if (practiceInput.length === 0 || practiceInput !== getResponse()) { // do something more here
      setErrorMessage('Incorrect');
      setMessage('');
      setPracticeInput('');
    } else {
      setErrorMessage('');
      setMessage('Nice Job!');
      generateCall();
      setPracticeInput('');
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEnter();
    }
  }

  let pluralOption = isDecline ? <div> <FormLabel component='legend'> Plural or Non-Plural? </FormLabel>
  <FormGroup row>
    <FormControlLabel
      control={
        <Radio
          checked={plurality === 'singular'}
          onChange={(event) => setPlurality('singular')}
          color="primary"
        />
      }
      label="Singular"
    />
    <FormControlLabel
      control={
        <Radio
          checked={plurality === 'plural'}
          onChange={(event) => setPlurality('plural')}
          color="primary"
        />
      }
      label="Plural"
    />
    <FormControlLabel
      control={
        <Radio
          checked={plurality === 'both'}
          onChange={(event) => setPlurality('both')}
          color="primary"
        />
      }
      label="Both"
    />
  </FormGroup> </div> : <div/>;

  let virileOption = (isDecline && (plurality === 'both' || plurality === 'plural') && gender.masculine) ? <div> <FormLabel component='legend'> Virile or Non-Virile (or Animate/Non-Animate)? </FormLabel>
  <FormGroup row>
    <FormControlLabel
      control={
        <Radio
          checked={virility === 'virile'}
          onChange={(event) => setVirility('virile')}
          color="primary"
        />
      }
      label="Virile"
    />
    <FormControlLabel
      control={
        <Radio
          checked={virility === 'nonvirile'}
          onChange={(event) => setVirility('nonvirile')}
          color="primary"
        />
      }
      label="Non-Virile"
    />
    <FormControlLabel
      control={
        <Radio
          checked={virility === 'both'}
          onChange={(event) => setVirility('both')}
          color="primary"
        />
      }
      label="Both"
    />
  </FormGroup> </div> : <div/>;

  let casesOption = (isDecline) ? <div> <FormLabel component='legend'> What Cases? </FormLabel>
  <FormLabel component='legend' error={true}> {caseError} </FormLabel>
  <FormGroup row>
    <FormControlLabel
      control={
        <Checkbox
          checked={cases.dopełniacz}
          onChange={(event) => setCasesWithError({ ...cases, dopełniacz: event.target.checked })}
          color="primary"
        />
      }
      label="Dopełniacz"
    />
    <FormControlLabel
      control={
        <Checkbox
          checked={cases.celownik}
          onChange={(event) => setCasesWithError({ ...cases, celownik: event.target.checked })}
          color="primary"
        />
      }
      label="Celownik"
    />
    <FormControlLabel
      control={
        <Checkbox
          checked={cases.biernik}
          onChange={(event) => setCasesWithError({ ...cases, biernik: event.target.checked })}
          color="primary"
        />
      }
      label="Biernik"
    />
    <FormControlLabel
      control={
        <Checkbox
          checked={cases.narzędnik}
          onChange={(event) => setCasesWithError({ ...cases, narzędnik: event.target.checked })}
          color="primary"
        />
      }
      label="Narzędnik"
    />
    <FormControlLabel
      control={
        <Checkbox
          checked={cases.miejscownik}
          onChange={(event) => setCasesWithError({ ...cases, miejscownik: event.target.checked })}
          color="primary"
        />
      }
      label="Miejscownik"
    />
  </FormGroup> </div> : <div/>;

  if (!inPracticeMode) {
    return (
      <div className="App">
        <Box m={2}>
          <Box m='auto' align='center'>
            <Grid container style={{maxWidth: '1000px'}} spacing={2} alignContent='center'>
              <Grid container item xs={12}>
                <Typography variant='h3'> Polish Grammar Practice </Typography>
              </Grid>
              <Grid container item xs={12} alignContent='center'>
                <FormGroup>
                  <FormLabel component='legend'> What would you like to practice? </FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={isDecline}
                          onChange={(event) => setIsDecline(true)}
                          color="primary"
                        />
                      }
                      label="Declension"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={!isDecline}
                          onChange={(event) => setIsDecline(false)}
                          color="primary"
                        />
                      }
                      label="Pluralization"
                    />
                  </FormGroup>
                  {casesOption}
                  <FormLabel component='legend'> With or without adjectives? </FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={withAdjectives}
                          onChange={(event) => setWithAdjectives(true)}
                          color="primary"
                        />
                      }
                      label="With Adjectives"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={!withAdjectives}
                          onChange={(event) => setWithAdjectives(false)}
                          color="primary"
                        />
                      }
                      label="Without Adjectives"
                    />
                  </FormGroup>
                  {pluralOption}
                  <FormLabel component='legend'> What Genders? </FormLabel>
                  <FormLabel component='legend' error={true}> {genderError} </FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.masculine}
                          onChange={(event) => setGenderWithError({ ...gender, masculine: event.target.checked })}
                          color="primary"
                        />
                      }
                      label="Masculine"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.feminine}
                          onChange={(event) => setGenderWithError({ ...gender, feminine: event.target.checked })}
                          color="primary"
                        />
                      }
                      label="Feminine"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.neuter}
                          onChange={(event) => setGenderWithError({ ...gender, neuter: event.target.checked })}
                          color="primary"
                        />
                      }
                      label="Neuter"
                    />
                  </FormGroup>
                  {virileOption}
                </FormGroup>
              </Grid>
              <Grid container item xs={12}>
                <Button onClick={() => {
                    if ((isDecline && caseError !== '') || genderError !== '') {
                      return;
                    }
                    generateCall();
                    setInPracticeMode(true);
                  }}>
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
              <IconButton onClick={() => {
                setInPracticeMode(false);
                setMessage('');
                setErrorMessage('');
              }}>
                <ArrowBack/>
              </IconButton>
            </Grid>
            <Grid container item xs={12}>
              <Typography variant='h6'> What is {callAdjective !== null ? getAdjectiveForQuestion() : ''} {callNoun[callPlurality].mianownik} {isDecline ? `in ${callCase}` : 'plural'}? </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Typography variant='subtitle'> {message} </Typography>
              <Typography color='error' variant='subtitle'> {errorMessage} </Typography>
            </Grid>
            <Grid container item xs={8}>
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
            <Grid container item xs={2}>
              <Button onClick={() => showAnswer()}>
                Show Answer
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default App;
