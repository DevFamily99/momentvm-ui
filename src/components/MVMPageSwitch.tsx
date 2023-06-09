import React from 'react';
import styled from 'styled-components';

const SwitchWrapper = styled.div`
  padding-left: 20px;
  display: flex;
  height: max-content;
  align-items: center;
  .switch {
    transition: all 200ms ease-in-out;
    display: inline-block;
    position: relative;
    height: 30px;
    width: 20px;
    cursor: pointer;
    color: transparent;
    margin-right: 2rem;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      background-color: inherit;
      border-radius: 50%;
      width: 2rem;
      height: 30px;
      z-index: 2;
    }
    &:before {
      left: -1rem;
    }
    &:after {
      right: -1rem;
    }

    &:focus {
      outline: none;
    }

    &.switch_is-off {
      background-color: #ddd;
    }

    &.switch_is-on {
      background-color: #64bd63;
    }
  }
`;

const ToggleButtonWrapper = styled.div`
  .toggle-button {
    transition: all 200ms ease-in-out;
    content: ' ';
    position: absolute;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background-color: white;
    top: 3px;
    z-index: 3;
    left: 3px;
    right: auto;
    box-shadow: 1px 1px 1px grey;
  }

  .toggle-button_position-left {
    transform: translateX(-1rem);
  }
  .toggle-button_position-right {
    transform: translateX(0.3rem);
  }
`;
interface ToggleProps {
  isOn?: boolean;
}

const ToggleButton = ({ isOn }: ToggleProps) => {
  const classNames = ['toggle-button', isOn ? 'toggle-button_position-right' : 'toggle-button_position-left'].join(' ');
  return (
    <ToggleButtonWrapper>
      <div className={classNames} />
    </ToggleButtonWrapper>
  );
};

interface SwitchProps {
  isOn?: boolean;
  value: string;
  className?: string;
  handleToggle: (id: number) => void;
}

const MVMPageSwitch = ({ isOn, handleToggle, className, value }: SwitchProps) => {
  const classNames = ['switch', isOn ? 'switch_is-on' : 'switch_is-off'].join(' ');
  return (
    <SwitchWrapper className={`mvm-switch ${className || ''}`}>
      <div className={classNames} onClick={() => handleToggle(value)} onKeyPress={handleToggle} tabIndex={0} role="button">
        <ToggleButton isOn={isOn} />
      </div>
    </SwitchWrapper>
  );
};

export default MVMPageSwitch;
