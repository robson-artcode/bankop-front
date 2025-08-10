'use client';

import { Button, ButtonGroup, Heading, Stack } from "@chakra-ui/react";
import styles from "../page.module.css";

interface CtaSectionProps {
  onSignUp: () => void;
}

export const CtaSection = ({ onSignUp }: CtaSectionProps) => (
  <Stack direction="column" gap={6} className={styles.main}>
    <Heading size="2xl" textAlign="center">
      Aproveite e ganhe pontos!
    </Heading>
    
    <Heading size="lg" textAlign="center" fontWeight="normal">
      Crie agora mesmo a sua conta no BankOp e ganhe 5.000 pontos para serem usados como quiser em nossa aplicação.
    </Heading>

    <ButtonGroup size="xl" width="100%">
      <Button
        width="100%"
        bgColor="#1E40AF"
        color="white"
        onClick={onSignUp}
        size="lg"
      >
        CRIAR MINHA CONTA
      </Button>
    </ButtonGroup>
  </Stack>
);