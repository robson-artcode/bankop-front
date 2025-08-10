'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { Input, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { PasswordInput } from "@/components/ui/password-input";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useEffect, useState, FormEvent } from "react";
import { ThemeToggle } from "./components/ThemeToggle";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export default function HomePage() {
  const router = useRouter();

  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Verifica autenticação inicial
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      router.push("/painel");
    } else {
      setIsUserAuthenticated(false);
    }
  }, [router]);

  // Exibe toast salvo no localStorage
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

  const handleLoginSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

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
    }
  };

  if (isUserAuthenticated === null) return null;

  return (
    <div className={styles.page} style={{ maxWidth: "950px", margin: "0 auto" }}>
      {/* Coluna do Login */}
      <div className={styles.main}>
        <Image
          className={styles.logo}
          src="/bankop-logo.png"
          alt="Logo BankOp"
          width={360}
          height={60}
          priority
          style={{
            marginBottom: '1.1rem',
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "400px"
          }}
        />
        <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
          <ol style={{ width: '100%', padding: 0, margin: 0 }}>
            <li>
              <Input
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
              />
              <PasswordInput
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                style={{ margin: '1rem 0' }}
              />
            </li>
            <li>
              <ButtonGroup size="xl" style={{ width: "100%" }}>
                <Button style={{ width: "100%" }} bgColor="#1E40AF" type="submit">
                  ENTRAR
                </Button>
              </ButtonGroup>
            </li>
          </ol>
        </form>
      </div>

      {/* Coluna de CTA */}
      <div className={styles.main} style={{ marginTop: 0 }}>
        <Heading size="2xl" style={{ marginBottom: '1rem', textAlign: "center" }}>
          Aproveite e ganhe pontos!
        </Heading>
        <Heading size="lg" style={{ marginBottom: '2.7rem', textAlign: "center" }}>
          Crie agora mesmo a sua conta no BankOp e ganhe 5.000 pontos para serem usados como quiser em nossa aplicação.
        </Heading>
        <ol style={{ width: '100%', padding: 0, margin: 0 }}>
          <li>
            <ButtonGroup size="xl" style={{ width: "100%" }}>
              <Button
                bgColor="#1E40AF"
                style={{ width: "100%" }}
                onClick={() => router.push('/criar-conta')}
              >
                CRIAR MINHA CONTA
              </Button>
            </ButtonGroup>
          </li>
        </ol>
      </div>

      <Toaster />
      <ThemeToggle />
    </div>
  );
}
