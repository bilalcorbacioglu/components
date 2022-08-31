import styled from 'styled-components';
import { Box } from 'src/components';

export const Wrapper = styled(Box)`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
  margin-top: 10px;
  padding: 30px;
  height: 295px;
  display: flex;
  flex-direction: column;
  * {
    box-sizing: border-box;
  }
`;

export const InnerWrapper = styled(Box)<{ flexDirection?: string }>`
  display: flex;
  flex-direction: ${({ flexDirection }) => (flexDirection ? flexDirection : 'column')};
  justify-content: center;
  margin-top: 28px;
`;
