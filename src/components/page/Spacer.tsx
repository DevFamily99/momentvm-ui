import styled from 'styled-components';

interface SpacerProps {
  factor: number;
}

/**
 * The Spacer has a height measured by the factor prop x rem
 *
 * Obviously you should carefully consider whether your component might not
 * benefit from having its own padding or margin.
 *
 * In some cases however you don't want to change the margins on the component
 * itself. This is where `Spacer` can come in handy.
 * @param factor: number
 */
const Spacer = styled.div`
  height: ${(props: SpacerProps) => `${props.factor}rem;`};
`;

export default Spacer;
