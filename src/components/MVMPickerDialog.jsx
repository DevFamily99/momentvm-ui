import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';
import { useQuery } from '@apollo/client';
import { useTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import Button from './MVMButton';
import CloseButton from './CloseButton';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const DialogTitleWrapper = styled.div`
  h2 {
    display: flex;
    justify-content: space-between;
    min-width: 20rem;
  }
`;

const DialogContentWrapper = styled.div`
  .createNewItemsButton {
    margin: 1rem 0;
    div {
      padding: 0;
      margin: 0;
    }
  }
`;

const MVMPickerDialog = ({
  showDialog,
  update,
  target,
  targetItems,
  refetch,
  query,
  itemName,
  itemVariableName,
  dialogTitle,
  createNewItemPath,
}) => {
  const initialSelect = targetItems.map((cg) => ({ value: cg.id, label: cg.name }));
  const [selectedItems, setSelectedItems] = useState(initialSelect);
  const { data, loading } = useQuery(query);

  const handleChange = (selected) => {
    setSelectedItems(selected);
  };

  let allItems = [];
  if (!loading) {
    allItems = data[itemVariableName].map((cg) => ({ value: cg.id, label: cg.name }));
  }
  const miUiTheme = useTheme();

  return (
    <Dialog open onClose={() => showDialog(false)}>
      <DialogTitleWrapper>
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
          <CloseButton
            func={() => {
              showDialog(false);
            }}
          />
        </DialogTitle>
      </DialogTitleWrapper>
      <DialogContentWrapper>
        <DialogContent>
          {allItems.length === 0 && (
            <p>You don&apos;t have yet created any {itemName}.</p>
          )}
          <Button
            onClick={() => {
              window.location = createNewItemPath;
            }}
            label={`Create new ${itemName}`}
            buttonState="none"
            trailingIcon="triangle"
            className="createNewItemsButton"
          />

          {allItems.length > 0 && (
            /* hidden select used to polyfill pupeeteer */
            <div>
              <select
                id="itemsSelect"
                hidden
                multiple
                onBlur={(e) => handleChange([{ value: e.target.value }])}
              >
                {allItems.map((cg) => (
                  <option key={cg.value} value={cg.value}>
                    {cg.label}
                  </option>
                ))}
              </select>
              <div style={{ height: '300px' }}>
                {!loading && (
                  <Select
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        text: miUiTheme.palette.text.primary,
                        primary25: miUiTheme.palette.action.selected,
                        neutral0: miUiTheme.palette.background.default,
                      },
                    })}
                    options={allItems}
                    value={selectedItems}
                    onChange={handleChange}
                    isMulti
                    isSearchable
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </DialogContentWrapper>

      <DialogActions>
        <ButtonContainer>
          {allItems.length > 0 && (
            <Button
              onClick={() => {
                const variables = { id: target.id };
                variables[itemVariableName] =
                  selectedItems && selectedItems.length > 0
                    ? selectedItems.map((s) => s.value)
                    : 'none';

                update({
                  variables,
                }).then(() => {
                  refetch();
                  showDialog(false);
                });
              }}
              color="primary"
              label="Save"
              buttonState="highlight"
            />
          )}
        </ButtonContainer>
      </DialogActions>
    </Dialog>
  );
};
export default MVMPickerDialog;
