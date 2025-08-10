'use client'

import { Input, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import styles from "../../page.module.css";

interface RegisterFormProps {
  fullName: string;
  email: string;
  password: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

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
      <Heading size="2xl" textAlign="center" mb={6}>
        Crie sua conta em alguns segundos
      </Heading>
      <ol className={styles.main}>
        <li>
          <Input
            placeholder="Nome completo"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className={styles.formInput}
            mb={4}
          />
          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={styles.formInput}
            mb={4}
          />
          <PasswordInput
            placeholder="Senha"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={styles.formInput}
            mb={6}
          />
        </li>
        <li>
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