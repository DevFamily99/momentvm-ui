import React, { FunctionComponent, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircle from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';

interface PulsingProps {
  pulsingColor: string;
}

type IconStates =
  | 'triangle'
  | 'someIcon'
  | 'pulsing'
  | 'add'
  | 'close'
  | 'edit'
  | 'check'
  | 'delete';

interface IconProps {
  icon?: IconStates;
  pulsingColor?: string;
}

interface ButtonWrapperProps {
  backgroundColor?: string;
  formButton?: boolean;
}

const ButtonWrapper = styled.div`
  border-radius: 100px;
  white-space: nowrap;
  background-color: ${(props: ButtonWrapperProps) => props.backgroundColor};
  color: black;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  padding: 0 15px;
  margin: ${(props: ButtonWrapperProps) => (props.formButton ? '0' : '0 10px')};
  min-height: 45px;
  cursor: pointer;
  & .pressed {
    color: #626262;
  }
  &:hover {
    background-color: #c1bebe;
  }
  & > p {
    flex: auto;
    padding: 0.8rem 0;
    margin: 0;
  }
  & > div {
    flex: 0 0 20px;
    position: relative;
  }

  &.highlight {
    color: #ffffff;
    &:hover {
      background-color: black;
    }
  }

  &.none {
    min-height: 0;
    p {
      padding: 0;
    }
    &:hover {
      background-color: transparent;
    }
  }
  & input.mvm-input {
    border: none;
    background: none;
    font-size: 1rem;
    cursor: pointer;
  }
`;

const Arrow = () => (
  <svg
    width="12px"
    height="21px"
    viewBox="0 0 44 83"
    version="1.1"
    style={{ paddingLeft: 10 }}
  >
    <title>Path 2 Copy</title>
    <desc>Right pointed triangle arrow</desc>
    <g
      id="lock-module-country-hide"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="Artboard"
        transform="translate(-464.000000, -18.000000)"
        fill="#979797"
        fillRule="nonzero"
      >
        <path
          d="M445.585786,38.5857864 C446.325727,37.8458457 447.501211,37.8069014 448.286999,38.4689537 L448.414214,38.5857864 L486,76.171 L523.585786,38.5857864 C524.325727,37.8458457 525.501211,37.8069014 526.286999,38.4689537 L526.414214,38.5857864 C527.154154,39.3257272 527.193099,40.5012114 526.531046,41.2869988 L526.414214,41.4142136 L486,81.8284271 L445.585786,41.4142136 C444.804738,40.633165 444.804738,39.366835 445.585786,38.5857864 Z"
          id="Path-2-Copy"
          transform="translate(486.000000, 59.914214) rotate(-90.000000) translate(-486.000000, -59.914214) "
        />
      </g>
    </g>
  </svg>
);

const ButtonLabel = styled.div`
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

const Icon: FunctionComponent<IconProps> = ({ icon, pulsingColor }) => {
  switch (icon) {
    case undefined:
      return null;
    case 'triangle':
      return <Arrow />;
    case 'pulsing' && pulsingColor:
      return <PulsingIndicator pulsingColor={pulsingColor} />;
    case 'pulsing':
      return <PulsingIndicator pulsingColor="white" />;
    case 'add':
      return <AddIcon />;
    case 'close':
      return <CloseIcon />;
    case 'edit':
      return <EditIcon />;
    case 'check':
      return <CheckCircle />;
    case 'delete':
      return <DeleteIcon />;
    default:
      return null;
  }
};

const PulsingIndicator = ({ pulsingColor }: PulsingProps) => (
  <motion.div
    style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: pulsingColor,
      marginRight: 10,
    }}
    animate={{ opacity: 0 }}
    transition={{
      loop: Infinity,
      duration: 2,
      ease: 'easeInOut',
    }}
  />
);

export interface ButtonProps {
  label: string | JSX.Element;
  buttonDownLabel?: string | JSX.Element;
  cornerRadius?: number;
  buttonState?: 'delete' | 'disabled' | 'highlight' | 'default' | 'none';
  type?: 'submit';
  pulsingColor?: string;
  leadingIcon?: IconStates;
  trailingIcon?: IconStates;
  backgroundColor?: string;
  onClick?: (any?) => void;
  target?: string;
  className?: string;
  formButton?: boolean;
  submit?: boolean;
}
/**
 * This is the main button component
 *
 * Use cases:
 * - If you want to create a stateful button, then set a `buttonDownLabel`
 *   which will causes the button to be deactivated and show the label
 *   once pressd
 *   ```
 *   <Button label="Hello" buttonDownLabel="Loading..." />
 *   ```
 * - A button can use a leading icon and a trailing icon
 *   You can choose from a few predefined icons
 *   ```
 *   <Button label="Lorem ipsum!" trailingIcon="triangle" />
 *   ```
 * - For navigating to a url, provide a `target` prop
 *   ```
 *   <Button label="Navigate to target" target="/?foo=true" />
 *   ```
 *  * - For a left-aligned button in a form, provide the `formButton`prop
 *   ```
 *   <Button label="Submit form" formButton />
 *   ```
 * - If the button should be used in an existing form, you should use `submit`
 *   so the button doens't create another form
 *   ```
 *   <Button label="Submit form" submit />
 *   ```
 * @param ButtonProps
 */
const MVMButton = ({
  label,
  buttonDownLabel,
  buttonState,
  pulsingColor,
  leadingIcon,
  trailingIcon,
  onClick,
  target,
  className,
  type,
  formButton,
  submit,
}: ButtonProps) => {
  const [pressed, setPressed] = useState(false);

  const newBackgroundColor = buttonState => {
    switch (buttonState) {
      case 'delete':
        return '#ff7e00';
      case 'highlight':
        return '#000000';
      case 'none':
        return 'transparent';
      default:
        return '#d8d8d8';
    }
  };
  interface FormProps {
    submit: boolean;
    inputEl: React.MutableRefObject<any>;
    label: JSX.Element | string;
  }
  const Form = ({ submit, inputEl, label }) => {
    // If submit prop is not true, we dont want a from wrapper
    if (!submit) {
      return (
        <form>
          <input className="mvm-input" ref={inputEl} type="submit" value={label} />
        </form>
      );
    }
    return (
      <input
        className="mvm-input"
        style={{ color: 'white' }}
        ref={inputEl}
        type="submit"
        value={label}
      />
    );
  };

  const onClickHandler = event => {
    if (pressed) {
      return;
    }
    if (buttonState === 'disabled') {
      return;
    }
    // If there is a label for a pressed state
    // we set the button to the presed state
    if (buttonDownLabel) {
      setPressed(!pressed);
    }
    // If a target prop is provided, we navigate there
    if (target) {
      window.location.href = target || '#';
    }
    // / You can supply a custom click function
    if (onClick) {
      const promise = new Promise((resolve, reject) => {
        try {
          resolve(onClick(event));
        } catch (e) {
          reject(e);
        }
      });
      promise.then(() => setPressed(false));
    }
  };
  const inputEl = useRef(null);
  return (
    <motion.div
      className={`mvm-button ${className || ''} ${buttonState || ''}`}
      onClick={onClickHandler}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      style={{ display: 'inline-block', width: 'max-content' }}
    >
      <ButtonWrapper
        formButton={formButton}
        backgroundColor={newBackgroundColor(buttonState)}
        className={buttonState}
      >
        <Icon icon={leadingIcon} pulsingColor={pulsingColor} />
        {type === 'submit' ? (
          <Form submit={submit} inputEl={inputEl} label={label} />
        ) : (
          <ButtonLabel>
            {pressed ? <span className="pressed">{buttonDownLabel}</span> : label}
          </ButtonLabel>
        )}

        <Icon icon={trailingIcon} pulsingColor={pulsingColor} />
      </ButtonWrapper>
    </motion.div>
  );
};

export default MVMButton;
