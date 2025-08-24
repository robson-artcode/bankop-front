"use client"

import { Dialog, Portal, createOverlay } from "@chakra-ui/react"

interface DialogProps {
  title: string 
  description?: string 
  content?: React.ReactNode 
}

/**
 * Componente que gerencia a exibição de diálogos modais
 * 
 * Utiliza o sistema de overlay do Chakra UI para criar modais consistentes
 * com título, descrição e conteúdo personalizável.
 * 
 * @param title - Título principal do diálogo (obrigatório)
 * @param description - Texto descritivo do diálogo (opcional)
 * @param content - Conteúdo React personalizado (opcional)
 * @param rest - Demais propriedades do componente Dialog
 * @returns Componente de diálogo modal configurável
 */
export const OverlayManager = createOverlay<DialogProps>((props) => {
  // Desestrutura as propriedades do componente
  const { title, description, content, ...rest } = props

  return (
    <Dialog.Root {...rest} size={"xs"}>
      <Portal>
        {/* Fundo escuro do modal */}
        <Dialog.Backdrop />
        
        {/* Posicionador do conteúdo do modal */}
        <Dialog.Positioner>
          {/* Conteúdo principal do modal */}
          <Dialog.Content>
            {/* Cabeçalho com título (renderizado apenas se title existir) */}
            {title && (
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
            )}
            
            {/* Corpo do modal com espaçamento vertical */}
            <Dialog.Body spaceY="4">
              {/* Descrição (renderizada apenas se description existir) */}
              {description && (
                <Dialog.Description>{description}</Dialog.Description>
              )}
              
              {/* Conteúdo personalizado (renderizado apenas se content existir) */}
              {content}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
})