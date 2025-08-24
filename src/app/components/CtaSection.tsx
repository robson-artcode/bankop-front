'use client';

import { Button, ButtonGroup, Heading, Stack } from "@chakra-ui/react";
import styles from "../page.module.css";

interface CtaSectionProps {
  onSignUp: () => void;
}

/**
 * Componente de Chamada para Ação (Call To Action)
 * 
 * Exibe um bloco persuasivo com título, descrição e botão para incentivar
 * o cadastro de novos usuários, oferecendo benefícios imediatos.
 * 
 * @param onSignUp - Função de callback para o evento de clique no botão
 * @returns Componente de seção CTA para cadastro
 */
export const CtaSection = ({ onSignUp }: CtaSectionProps) => (
  <Stack direction="column" gap={6} className={styles.main}>
    {/* Título principal da seção CTA */}
    <Heading size="2xl" textAlign="center">
      Aproveite e ganhe pontos!
    </Heading>
    
    {/* Descrição com oferta de benefícios */}
    <Heading 
      size="lg" 
      textAlign="center" 
      fontWeight="normal"
    >
      Crie agora mesmo a sua conta no BankOp e ganhe 5.000 pontos 
      para serem usados como quiser em nossa aplicação.
    </Heading>

    {/* Container do botão principal */}
    <ButtonGroup size="xl" width="100%">
      <Button
        width="100%"
        bgColor="#1E40AF"
        color="white"
        onClick={onSignUp}
        size="lg"
        _hover={{
          bgColor: "#1E3A8A"
        }}
      >
        CRIAR MINHA CONTA
      </Button>
    </ButtonGroup>
  </Stack>
);