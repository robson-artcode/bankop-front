'use client'

import { Input, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import styles from "../../page.module.css";

interface RegisterFormProps {
  fullName: string; // Valor atual do campo nome completo
  email: string; // Valor atual do campo e-mail
  password: string; // Valor atual do campo senha
  onFullNameChange: (value: string) => void; // Handler para mudança no campo nome
  onEmailChange: (value: string) => void; // Handler para mudança no campo e-mail
  onPasswordChange: (value: string) => void; // Handler para mudança no campo senha
  onSubmit: () => void; // Função chamada ao submeter o formulário
  isLoading?: boolean; // Indica se o formulário está em estado de carregamento
}

/**
 * Componente de formulário de registro
 * 
 * Exibe campos para nome completo, e-mail e senha, além de botão de submissão.
 * Recebe handlers para gerenciamento de estado externamente (controlled component).
 * 
 * @param fullName - Valor atual do campo nome completo
 * @param email - Valor atual do campo e-mail
 * @param password - Valor atual do campo senha
 * @param onFullNameChange - Callback para alterações no campo nome
 * @param onEmailChange - Callback para alterações no campo e-mail
 * @param onPasswordChange - Callback para alterações no campo senha
 * @param onSubmit - Callback para submissão do formulário
 * @param isLoading - Indica se está em processo de registro
 * @returns Componente de formulário de registro
 */
export const RegisterForm = ({
  fullName,
  email,
  password,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading,
}: RegisterFormProps) => (
  <div className={styles.page}>
    <main className={styles.main}>
      {/* Título do formulário */}
      <Heading size="2xl" textAlign="center" mb={6}>
        Crie sua conta em alguns segundos
      </Heading>
      
      <ol className={styles.main}>
        <li>
          {/* Campo para nome completo */}
          <Input
            placeholder="Nome completo"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className={styles.formInput}
            mb={4}
          />
          
          {/* Campo para e-mail */}
          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={styles.formInput}
            mb={4}
          />
          
          {/* Campo para senha (com componente especializado) */}
          <PasswordInput
            placeholder="Senha"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={styles.formInput}
            mb={6}
          />
        </li>
        
        <li>
          {/* Grupo de botões (contendo apenas o botão de submissão) */}
          <ButtonGroup className={styles.formButtonGroup}>
            <Button
              className={styles.submitButton}
              onClick={onSubmit}
              loading={isLoading}
              loadingText="Criando conta..."
              size="lg"
            >
              CRIAR CONTA
            </Button>
          </ButtonGroup>
        </li>
      </ol>
    </main>
  </div>
);