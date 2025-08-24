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

/**
 * Componente de logout que exibe um modal de confirmação
 * 
 * @returns JSX.Element
 */
export function Logout() {

  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  /**
   * Executa o logout removendo o token e redirecionando para a página inicial
   */
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    router.push('/')
    onClose()
  }

  return (
    <>
      {/* Botão de logout fixo no canto superior direito */}
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

      {/* Modal de confirmação de logout */}
      <Dialog.Root
        open={open}
        onOpenChange={(details) => {
          if (!details.open) onClose()
        }}
        role="alertdialog"
        placement="center" 
      >
        {/* Fundo escuro do modal */}
        <DialogBackdrop />
        
        {/* Conteúdo principal do modal */}
        <DialogContent
          maxWidth={{ base: '90vw', md: '400px' }}
          maxHeight={{ base: '80vh', md: 'auto' }}
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          margin="0"
        >
          {/* Cabeçalho do modal */}
          <DialogHeader>
            <DialogTitle fontSize="lg" fontWeight="bold">
              Confirmar Logout
            </DialogTitle>
          </DialogHeader>

          {/* Corpo do modal com mensagem de confirmação */}
          <DialogBody>
            Tem certeza que deseja sair da sua conta?
          </DialogBody>

          {/* Rodapé com ações */}
          <DialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleLogout} 
              ml={3} 
            >
              Sair
            </Button>
          </DialogFooter>

          {/* Botão de fechar (acessibilidade) */}
          <DialogCloseTrigger />
        </DialogContent>
      </Dialog.Root>
    </>
  )
}