import React from 'react';
import { Box, Text } from '../';
import CloseCircle from '../CloseCircle';
import { DrawerContent, DrawerRoot } from './styled';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
}

export default function Drawer({ isOpen, onClose, children, title, backgroundColor }: DrawerProps) {
  return (
    <DrawerRoot isOpen={isOpen} backgroundColor={backgroundColor}>
      {title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="20px">
          <Text color="text1" fontSize={21} fontWeight={800}>
            {title}
          </Text>
        </Box>
      )}

      <CloseCircle onClick={onClose} />

      <DrawerContent>{children}</DrawerContent>
    </DrawerRoot>
  );
}
