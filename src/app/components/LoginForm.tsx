'use client';

import { Input, Button, ButtonGroup, Stack, Box } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { FormEvent } from "react";
import styles from "../page.module.css";

interface LoginFormProps {
  email: string; // Valor atual do campo e-mail
  password: string; // Valor atual do campo senha
  onEmailChange: (value: string) => void; // Handler para mudança no e-mail
  onPasswordChange: (value: string) => void; // Handler para mudança na senha
  onSubmit: (e?: FormEvent) => void; // Handler para submissão do formulário
  isLoading?: boolean; // Indica se o login está em processamento
}

/**
 * Componente de formulário de login
 * 
 * Exibe campos para e-mail e senha, com tratamento de submissão.
 * Implementado como controlled component para gerenciamento externo de estado.
 * 
 * @param email - Valor atual do campo e-mail
 * @param password - Valor atual do campo senha
 * @param onEmailChange - Callback para alterações no e-mail
 * @param onPasswordChange - Callback para alterações na senha
 * @param onSubmit - Callback para submissão do formulário
 * @param isLoading - Indica estado de carregamento
 * @returns Componente de formulário de login
 */
export const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading,
}: LoginFormProps) => (
  <form onSubmit={onSubmit} className={styles.main}>
    <Stack direction="column" gap={4} width="100%">
      {/* Campo de e-mail */}
      <Box>
        <Box 
          as="label" 
          display="block" 
          mb={2} 
          fontSize="sm" 
          fontWeight="medium"
        >
          E-mail
        </Box>
        <Input
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={styles.inputField}
          size="lg"
          type="email"
          required // Validação HTML5
          autoComplete="username" // Auxilia preenchimento automático
        />
      </Box>

      {/* Campo de senha */}
      <Box>
        <Box 
          as="label" 
          display="block" 
          mb={2} 
          fontSize="sm" 
          fontWeight="medium"
        >
          Senha
        </Box>
        <PasswordInput
          placeholder="Sua senha"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className={styles.inputField}
          size="lg"
          required // Validação HTML5
          autoComplete="current-password" // Auxilia preenchimento automático
        />
      </Box>

      {/* Botão de submissão */}
      <ButtonGroup size="xl" width="100%" paddingTop={"30px"}>
        <Button
          width="100%"
          bgColor="#1E40AF"
          color="white"
          type="submit"
          loading={isLoading}
          loadingText="Entrando..."
          size="lg"
          _hover={{
            bgColor: "#153082" // Efeito hover
          }}
          _disabled={{
            opacity: 0.7,
            cursor: "not-allowed"
          }}
        >
          ENTRAR
        </Button>
      </ButtonGroup>
    </Stack>
  </form>
);