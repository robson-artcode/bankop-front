'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Input, Button, ButtonGroup, Heading } from "@chakra-ui/react"
import { useRouter } from 'next/navigation'
import { PasswordInput } from "@/components/ui/password-input"
import { Toaster, toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const toastRaw = localStorage.getItem("toast")
    if (toastRaw) {
      const toast = JSON.parse(toastRaw)
      toaster.create({
        ...toast,
        closable: true,
        duration: 5000
      })
      localStorage.removeItem("toast")
    }
  }, [])

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3333/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const error = await res.json()
        toaster.create({
          title: "Erro no login",
          description: error.message || "Credenciais inválidas",
          type: "error",
          duration: 5000,
          closable: true
        })
        return
      }

      const data = await res.json()

      localStorage.setItem("access_token", data.access_token)

      localStorage.setItem("toast", JSON.stringify({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel!",
        status: "success"
      }))

      router.push("/painel")
    } catch (err) {
      toaster.create({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde.",
        type: "error",
        duration: 5000,
        closable: true
      })
    }
  }

  return (
    <div className={styles.page} style={{ maxWidth: "950px", margin: "0 auto"}}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/bankop-logo.png"
          alt="Next.js logo"
          width={360}
          height={60}
          priority
        />
        <ol>
          <li>
            <Input
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              placeholder="Senha"
              style={{ margin: "15px auto" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
          <li>
            <ButtonGroup size="xl" style={{ width: "100%" }}>
              <Button
                style={{ width: "100%" }}
                colorPalette="blue"
                onClick={handleLogin}
              >
                ENTRAR
              </Button>
            </ButtonGroup>
          </li>
        </ol>
      </main>

      <main className={styles.main}>
        <ol>
          <Heading size="2xl" style={{ margin: "30px auto", textAlign: "center"}}>
            Aproveite e ganhe pontos!
          </Heading>
          <Heading size="lg" style={{ margin: "8px auto", textAlign: "center"}}>
            Crie agora mesmo a sua conta no BankOp e ganhe 5.000 pontos para serem usados como quiser em nossa aplicação. Aproveite e garanta essa oportunidade.
          </Heading>
          <li>
            <ButtonGroup size="xl" style={{ width: "100%" }}>
              <Button
                colorPalette="blue"
                style={{ width: "100%" }}
                onClick={() => router.push('/criar-conta')}
              >
                CRIAR MINHA CONTA
              </Button>
            </ButtonGroup>
          </li>
        </ol>
      </main>

      <Toaster />
    </div>
  )
}
