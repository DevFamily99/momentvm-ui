import React, { useState, useEffect, useRef, FunctionComponent } from 'react';
import styled from 'styled-components';

const Label = styled.label``;
const Wrapper = styled.div``;

interface FlyoutProps {
  isOpen: boolean;
}

const FlyoutMenuWrapper = styled.div<FlyoutProps>`
  position: relative;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const FlyoutMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`;

const CurrentOption = styled.div``;
const OptionElement = styled.div``;
const InputWrapper = styled.div`
  display: flex;
`;
const SearchField = styled.input``;

/**
 * An Option consistes of a title and an id. The title will be shown to the user
 */
export interface Option {
  title: string;
  id: string;
}

interface Props {
  defaultOption: Option;
  // Setting `value` makes it an controlled component.
  // This means it wont rely on its own state
  value?: Option;
  options: Option[];
  onSelectedOption: (option: Option) => void;
  label?: JSX.Element | string;
}

const Autocomplete: FunctionComponent<Props> = ({
  defaultOption,
  options,
  onSelectedOption,
  label,
  value,
}) => {
  // In uncontrolled state its value otherwise defaultOption
  const [selectedOption, selectOption] = useState(value || defaultOption);
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [flyoutIsOpen, toggleFlyout] = useState(false);
  // Create an empty node and assign it via reg
  const node = useRef<HTMLInputElement>(null);
  const searchBox = useRef(null);
  // Handle a click outside the menu to close it
  const handleClick = (e: MouseEvent) => {
    if (node.current) {
      if (e.target == null) {
        return;
      }
      if (e.target instanceof Node) {
        if (node.current.contains(e.target)) {
          // inside click
          return;
        }
      }
    }
    // outside click
    toggleFlyout(false);
  };
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  useEffect(() => {
    const filtered = options.filter(opt => {
      const regex = new RegExp(`${query}`, 'gi');
      return opt.title.match(regex);
    });
    setFilteredOptions(filtered);
  }, [query, options]);

  useEffect(() => {
    searchBox.current.focus();
  }, [flyoutIsOpen]);

  return (
    <Wrapper className="mvm--autocomplete-wrapper">
      {label && <Label>{label}</Label>}
      <InputWrapper
        onClick={() => {
          toggleFlyout(true);
        }}
      >
        {!flyoutIsOpen && (
          <CurrentOption className="mvm--current-option">
            {selectedOption.title}
          </CurrentOption>
        )}

        <SearchField
          placeholder="Search.."
          value={query}
          onChange={e => setQuery(e.target.value)}
          ref={searchBox}
          hidden={!flyoutIsOpen}
        />
      </InputWrapper>
      <FlyoutMenuWrapper isOpen={flyoutIsOpen}>
        <FlyoutMenu className="mvm--flyout-menu" ref={node}>
          {filteredOptions.map(option => (
            <OptionElement
              className="mvm--option-element"
              onClick={() => {
                // Calls the callback
                onSelectedOption(option);
                // Only if uncontrolled
                if (!value) {
                  selectOption(option);
                }
                toggleFlyout(false);
              }}
              key={option.id}
            >
              {option.title}
            </OptionElement>
          ))}
          {!filteredOptions.length && (
            <OptionElement className="mvm--option-element">Not Found</OptionElement>
          )}
        </FlyoutMenu>
      </FlyoutMenuWrapper>
    </Wrapper>
  );
};

export default Autocomplete;
