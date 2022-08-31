import React, { useContext } from 'react';
import { X } from 'react-feather';
import { ThemeContext } from 'styled-components';
import { Box } from '../';
import { Close } from './styled';

interface CloseCircleProps {
  onClick: () => void;
  right?: number;
  top?: number;
}

export default function CloseCircle({ onClick, right, top }: CloseCircleProps) {
  const theme = useContext(ThemeContext);
  return (
    <Box position="absolute" right={right || 20} top={top || 22}>
      <Close onClick={onClick}>
        <X color={theme.primary} size={10} />
      </Close>
    </Box>
  );
}
