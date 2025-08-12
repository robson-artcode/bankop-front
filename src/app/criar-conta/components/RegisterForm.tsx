'use client'

import { Input, Button, ButtonGroup, Heading, Box, Stack, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import styles from "../../page.module.css";

interface RegisterFormProps {
  fullName: string; // Valor atual do campo nome completo
  email: string; // Valor atual do campo e-mail
  password: string; // Valor atual do campo senha
  nameError: string; // Erro de validação do nome
  emailError: string; // Erro de validação do e-mail
  passwordError: string; // Erro de validação da senha
  onFullNameChange: (value: string) => void; // Handler para mudança no campo nome
  onEmailChange: (value: string) => void; // Handler para mudança no campo e-mail
  onPasswordChange: (value: string) => void; // Handler para mudança na senha
  onFullNameBlur: () => void; // Handler para blur do campo nome
  onEmailBlur: () => void; // Handler para blur do campo e-mail
  onPasswordBlur: () => void; // Handler para blur do campo senha
  onSubmit: () => void; // Função chamada ao submeter o formulário
  isLoading?: boolean; // Indica se o formulário está em estado de carregamento
}

/**
 * Componente de formulário de registro
 * 
 * Exibe campos para nome completo, e-mail e senha, além de botão de submissão.
 * Recebe handlers para gerenciamento de estado externamente (controlled component).
 * Suporta submissão via clique no botão ou pressionando Enter em qualquer campo.
 * 
 * @param fullName - Valor atual do campo nome completo
 * @param email - Valor atual do campo e-mail
 * @param password - Valor atual do campo senha
 * @param nameError - Erro de validação do nome
 * @param emailError - Erro de validação do e-mail
 * @param passwordError - Erro de validação da senha
 * @param onFullNameChange - Callback para alterações no campo nome
 * @param onEmailChange - Callback para alterações no campo e-mail
 * @param onPasswordChange - Callback para alterações na senha
 * @param onFullNameBlur - Callback para blur do campo nome
 * @param onEmailBlur - Callback para blur do campo e-mail
 * @param onPasswordBlur - Callback para blur do campo senha
 * @param onSubmit - Callback para submissão do formulário
 * @param isLoading - Indica se está em processo de registro
 * @returns Componente de formulário de registro
 */
export const RegisterForm = ({
  fullName,
  email,
  password,
  nameError,
  emailError,
  passwordError,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onFullNameBlur,
  onEmailBlur,
  onPasswordBlur,
  onSubmit,
  isLoading,
}: RegisterFormProps) => (
  <Box>
    {/* Título do formulário */}
    <Heading size="2xl" textAlign="center" mb={6}>
      Crie sua conta em alguns segundos
    </Heading>
    
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <Stack direction="column" gap={4} width="100%">
        {/* Campo para nome completo */}
        <Box>
          <Box 
            as="label" 
            display="block" 
            mb={2} 
            fontSize="sm" 
            fontWeight="medium"
          >
            Nome completo
          </Box>
          <Input
            placeholder="Nome completo"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            onBlur={onFullNameBlur}
            className={styles.formInput}
            size="lg"
            required
            autoComplete="name"
          />
          {nameError && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {nameError}
            </Text>
          )}
        </Box>
        
        {/* Campo para e-mail */}
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
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={onEmailBlur}
            className={styles.formInput}
            size="lg"
            required
            autoComplete="email"
          />
          {emailError && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {emailError}
            </Text>
          )}
        </Box>
        
        {/* Campo para senha */}
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
            placeholder="Senha"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={onPasswordBlur}
            className={styles.formInput}
            size="lg"
            required
            autoComplete="new-password"
          />
          {passwordError && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {passwordError}
            </Text>
          )}
        </Box>
        
        {/* Botão de submissão */}
        <ButtonGroup size="lg" width="100%" paddingTop="30px">
          <Button
            width="100%"
            bgColor="#1E40AF"
            color="white"
            type="submit"
            loading={isLoading}
            loadingText="Criando conta..."
            size="lg"
            _hover={{
              bgColor: "#153082"
            }}
            _disabled={{
              opacity: 0.7,
              cursor: "not-allowed"
            }}
            disabled={!!nameError || !!emailError || !!passwordError}
          >
            CRIAR CONTA
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  </Box>
);