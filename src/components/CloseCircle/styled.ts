import styled from 'styled-components';

export const Close = styled.div<{ onClick: () => void }>`
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2.5px 8px;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;
`;
