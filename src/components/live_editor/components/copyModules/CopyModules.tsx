import React, { useState } from 'react';
import styled from 'styled-components';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button } from 'semantic-ui-react';
import PageSearch from './PageSearch';
import ModuleSearch from './ModuleSearch';

const ModuleInsertContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StepperContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

const stepperStyles = {
  width: '100%',
  textAlign: 'center',
  justifyContent: 'center',
};

const buttonStyles = {
  border: 'none',
  display: 'flex',
};

const moduleInsertStyles = {
  width: '100%',
};

const getSteps = () => ['Select a page', 'Drag and drop the module into the page'];

const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiStepIcon: {
      root: {
        '&$active': {
          fill: 'black',
          '& $text': {
            fill: 'white',
          },
        },
        '&$completed': {
          fill: 'black',
          '& $text': {
            fill: 'white',
          },
        },
      },
    },
    MuiTypography: {
      body2: {
        textAlign: 'left',
      },
    },
    MuiStepConnector: {
      line: {
        minWidth: '15px',
      },
    },
  },
});

const CopyModules = ({ hide }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedPage, setSelectedPage] = useState({});
  const steps = getSteps();

  const nextSteps = page => {
    setSelectedPage(page);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const prevStep = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div style={moduleInsertStyles}>
        <ModuleInsertContainer>
          <Button onClick={activeStep > 0 ? prevStep : hide} style={buttonStyles}>
            <img alt="" src="/images/editor/arrowLeftSmall.svg" />
          </Button>

          <StepperContainer>
            <Stepper activeStep={activeStep} style={stepperStyles}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </StepperContainer>
        </ModuleInsertContainer>
        {activeStep === 0 ? <PageSearch next={nextSteps} /> : <ModuleSearch hide={hide} page={selectedPage} />}
      </div>
    </MuiThemeProvider>
  );
};

export default CopyModules;
