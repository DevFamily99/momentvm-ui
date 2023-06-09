import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { toast } from 'react-toastify';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';

import Button from './MVMButton';
import CloseButton from './CloseButton';

const DialogTitleWrapper = styled.div`
  h2 {
    display: flex;
    justify-content: space-between;
    min-width: 20rem;
  }
`;

const DialogContentWrapper = styled.div`
  min-height: 8rem;
  > div {
    height: 100%;
  }
`;

interface DialogProps {
  showDialog: Function;
  title: string;
  content: JSX.Element;
  mutation: Function;
  validations?: Function;
  mutationVariables: Record<string, any>;
  refetch: Function;
  errors?: any[];
  setErrors?: Function;
  submitButtonState?: 'delete' | 'disabled' | 'highlight' | 'default' | 'none';
  showSubmitButton?: boolean;
  submitButtonLabel?: string;
  successToast?: string;
}

const MVMDialog = ({
  showDialog,
  title,
  content,
  validations,
  mutation,
  mutationVariables,
  refetch,
  errors,
  setErrors,
  submitButtonState = 'highlight',
  showSubmitButton = true,
  submitButtonLabel = 'Save',
  successToast = 'Changes saved',
}: DialogProps) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validations) {
      validations();
    }

    if (!errors || (errors && errors.length === 0)) {
      const variables = mutationVariables;

      mutation({ variables })
        .then(() => {
          toast.success(successToast);
          refetch();
          showDialog(false);
        })
        .catch((e) => {
          try {
            const errorsJson = JSON.parse(e.message.slice(15));
            const newErrors = [...errors];
            Object.keys(errorsJson).forEach((key) => {
              const errorsArr = errorsJson[key];
              errorsArr.forEach((error) =>
                newErrors.push({ field: key, message: error }),
              );
            });
            if (setErrors) {
              setErrors(newErrors);
            }
          } catch (e) {
            console.log(e);
          }
        });
    }
  };

  return (
    <Dialog open onClose={() => showDialog(false)}>
      <DialogTitleWrapper>
        <DialogTitle id="alert-dialog-title">
          {title}
          <CloseButton
            func={() => {
              showDialog(false);
            }}
          />
        </DialogTitle>
      </DialogTitleWrapper>
      <DialogContentWrapper>
        <DialogContent>{content}</DialogContent>
      </DialogContentWrapper>
      <DialogActions>
        {showSubmitButton && (
          <Button
            onClick={handleSubmit}
            label={submitButtonLabel}
            buttonState={submitButtonState}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};
export default MVMDialog;
