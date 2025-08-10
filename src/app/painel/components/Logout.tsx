'use client'

import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import { LuLogOut } from 'react-icons/lu'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

export function Logout() {
  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    
    router.push('/')
    onClose()
  }

  return (
    <>
      <Box
        position="fixed"
        top="4"
        right="4"
        zIndex="sticky"
      >
        <IconButton
          onClick={onOpen}
          variant="ghost"
          colorScheme="red"
          aria-label="Logout"
          size="lg"
          _hover={{
            bg: 'red.50',
          }}
        >
          <LuLogOut size="24" />
        </IconButton>
      </Box>

      <Dialog.Root
        open={open}
        onOpenChange={(details) => {
          if (!details.open) onClose()
        }}
        role="alertdialog"
        motionPreset="slide-in-bottom"
        placement="center"
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>
            <DialogTitle fontSize="lg" fontWeight="bold">
              Confirmar Logout
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            Tem certeza que deseja sair da sua conta?
          </DialogBody>
          <DialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleLogout} ml={3}>
              Sair
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </Dialog.Root>
    </>
  )
}