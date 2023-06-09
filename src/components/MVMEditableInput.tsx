/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
// border-bottom: 2px solid ${(props: EditableTextProps) => (props.text.length > 0 ? 'white' : 'black')};
const InputWrapper = styled.div`
  outline: none;
  border-bottom: 3px solid black;
  input {
    padding: 0;
    border-radius: 0;
    border: none;
    font-size: 3rem;
    font-weight: 900;
    min-height: 30px;

    &.small {
      font-size: initial;
      font-weight: normal;
    }
  }
`;
interface EditableTextProps {
  text: string;
}

const EditableText = styled.div`
  min-height: 30px;
  font-size: 3rem;
  font-weight: 900;
  max-width: 40rem;
  overflow: hidden;

  &.small {
    font-size: initial;
    font-weight: normal;
  }
`;

const Placeholder = styled.div`
  color: rgba(0, 0, 0, 0.54);
`;

interface EditableInputProps {
  value: string;
  size: 'large' | 'small';
  mutation?: Function;
  mutationVariables?: Record<string, any>;
  mutationUpdateParam?: string;
  onChange?: (string) => void;
  placeholder?: string;
}

/**
 * An Editable Input Field
 *
 * It is capable of mutating data on its own by supplying `mutation`, `mutationVariables` and `mutationUpateParam`
 *
 * onChange gets called when the user clicks outside of the text field
 */
const EditableInput = ({
  value,
  size,
  mutation,
  mutationVariables,
  mutationUpdateParam,
  onChange,
  placeholder,
}: EditableInputProps) => {
  const notNullValue: string = value || 'null';
  const [text, setText] = useState(notNullValue);
  const [inputVisible, setInputVisible] = useState(false);

  const inputRef = useRef(null);

  const onClickOutSide = e => {
    // Check if user is clicking outside of <input>
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setInputVisible(false); // Disable text input

      if (mutation) {
        const variables = mutationVariables;
        variables[mutationUpdateParam] = text;
        mutation({ variables });
      }

      if (onChange) {
        onChange(text);
      }
    }
  };

  // Resolves a bug where the fields prop was changed but the field was re-rendered
  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    // Handle outside clicks on mounted state
    if (inputVisible) {
      document.addEventListener('mousedown', onClickOutSide);
    }

    // This is a necessary step to "dismount" unnecessary events when we destroy the component
    return () => {
      document.removeEventListener('mousedown', onClickOutSide);
    };
  });

  return (
    <>
      <InputWrapper className="mvm-editable-input">
        {inputVisible ? (
          <input
            value={text}
            autoFocus
            type="text"
            ref={inputRef}
            className={size}
            onChange={e => {
              setText(e.target.value);
            }}
          />
        ) : (
          <EditableText
            role="button"
            className={size}
            onKeyDown={() => setInputVisible(true)}
            onClick={() => setInputVisible(true)}
            tabIndex={0}
            text={text}
          >
            {text || <Placeholder>{placeholder}</Placeholder>}
          </EditableText>
        )}
      </InputWrapper>
    </>
  );
};

export default EditableInput;
