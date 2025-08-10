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
  // Controle do estado do modal
  const { open, onOpen, onClose } = useDisclosure()
  
  // Referência para o botão de cancelar (acessibilidade)
  const cancelRef = useRef<HTMLButtonElement>(null)
  
  // Router para navegação
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
            bg: 'red.50', // Efeito hover sutil
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
        role="alertdialog"  // ARIA role para dialogs de alerta
        placement="center"  // Centraliza o modal na tela
      >
        {/* Fundo escuro do modal */}
        <DialogBackdrop />
        
        {/* Conteúdo principal do modal */}
        <DialogContent
          maxWidth={{ base: '90vw', md: '400px' }}  // Responsividade
          maxHeight={{ base: '80vh', md: 'auto' }}
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"  // Centralização perfeita
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
              ml={3}  // Margem à esquerda
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