'use client';

import { Box, Flex, useBreakpointValue  } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Toaster, toaster } from "../components/ui/toaster";
import { ThemeToggle } from "./components/ThemeToggle";
import { LoginForm } from "./components/LoginForm";
import { CtaSection } from "./components/CtaSection";
import { LogoHeader } from "./components/LogoHeader";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export default function HomePage() {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      router.push("/painel");
    } else {
      setIsUserAuthenticated(false);
    }
  }, [router]);

  useEffect(() => {
    const storedToastData = localStorage.getItem("toast");
    if (storedToastData) {
      const parsedToastData = JSON.parse(storedToastData);
      toaster.create({
        ...parsedToastData,
        closable: true,
        duration: 5000
      });
      localStorage.removeItem("toast");
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        toaster.create({
          title: "Erro no login",
          description: errorResponse.message || "Credenciais inválidas",
          type: "error",
          duration: 5000,
          closable: true
        });
        return;
      }

      const { access_token } = await response.json();
      localStorage.setItem("access_token", access_token);

      localStorage.setItem("toast", JSON.stringify({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel da BankOp!",
        status: "success"
      }));

      router.push("/painel");
    } catch (err) {
      console.error("Erro na requisição de login:", err);
      toaster.create({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde.",
        type: "error",
        duration: 5000,
        closable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/criar-conta');
  };

  if (isUserAuthenticated === null) return null;

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      padding="2rem"
    >
      <Flex
        width="100%"
        maxWidth="1200px"
        direction={isMobile ? "column" : "row"}
        justify="center"
        align="center"
        gap="4rem"
      >
        {/* Coluna do Login - Esquerda */}
        <Box
          width={isMobile ? "100%" : "50%"}
          maxWidth="500px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding="2rem"
        >
          <LogoHeader />
          <LoginForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            isLoading={loading}
          />
        </Box>

        {/* Coluna de CTA - Direita */}
        <Box
          width={isMobile ? "100%" : "50%"}
          maxWidth="500px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="2rem"
        >
          <CtaSection onSignUp={handleSignUp} />
        </Box>
      </Flex>

      <Toaster />
      <ThemeToggle />
    </Box>
  );
}