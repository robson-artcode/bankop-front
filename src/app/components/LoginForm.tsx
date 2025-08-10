'use client';

import { Input, Button, ButtonGroup, Stack, Box } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { FormEvent } from "react";
import styles from "../page.module.css";

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e?: FormEvent) => void;
  isLoading?: boolean;
}

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
      <Box>
        <Box as="label" display="block" mb={2} fontSize="sm" fontWeight="medium">
          E-mail
        </Box>
        <Input
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={styles.inputField}
          size="lg"
          type="email"
        />
      </Box>

      <Box>
        <Box as="label" display="block" mb={2} fontSize="sm" fontWeight="medium">
          Senha
        </Box>
        <PasswordInput
          placeholder="Sua senha"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className={styles.inputField}
          size="lg"
        />
      </Box>

      <ButtonGroup size="xl" width="100%" paddingTop={"30px"}>
        <Button
          width="100%"
          bgColor="#1E40AF"
          color="white"
          type="submit"
          loading={isLoading}
          loadingText="Entrando..."
          size="lg"
        >
          ENTRAR
        </Button>
      </ButtonGroup>
    </Stack>
  </form>
);