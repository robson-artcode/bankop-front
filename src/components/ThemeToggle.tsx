'use client'

import { ColorModeButton } from "@/components/ui/color-mode"
import { Box, IconButton } from '@chakra-ui/react'

export function ThemeToggle() {
  return (
    <Box
      position="fixed"
      top="4"
      left="4"
      zIndex="tooltip"
    >
      <ColorModeButton 
        as={IconButton}
        aria-label="Alternar tema"
        borderRadius="full"
        boxShadow="md"
        _hover={{
          transform: 'scale(1.1)',
          boxShadow: 'lg',
        }}
        transition="all 0.2s ease"
      />
    </Box>
  )
}