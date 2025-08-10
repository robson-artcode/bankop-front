'use client'

import { useState, useEffect } from "react"
import { Input, Button, ButtonGroup, Heading } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation'
import { PasswordInput } from "@/components/ui/password-input"
import { ThemeToggle } from "../components/ThemeToggle"
import styles from "../page.module.css"

const API_URL = process.env.API_URL as string;


export default function RegisterPage() {
  const router = useRouter()

  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthorized' | 'authorized'>('loading')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("access_token")
      if (token) {
        router.push("/painel")
      } else {
        setAuthStatus('unauthorized')
      }
    }
    checkAuthorization()
  }, [router])

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar conta')
      }

      localStorage.setItem("toast", JSON.stringify({
        description: "Conta criada com sucesso",
        type: "success"
      }))

      router.push('/')
    } catch (error) {
      toaster.create({
        description: "Erro ao criar conta",
        type: "error",
        closable: true,
      })
    }
  }

  if (authStatus === 'loading') return null

  return (
    <div
      className={styles.page}
      style={{ gridTemplateColumns: "auto", maxWidth: "500px", margin: "0 auto" }}
    >
      <main className={styles.main}>
        <Heading size="2xl" textAlign="center">
          Crie sua conta em alguns segundos
        </Heading>
        <ol>
          <li>
            <Input
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.formInput}
            />
            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
            />
            <PasswordInput
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
            />
          </li>
          <li>
            <ButtonGroup size="xl" className={styles.formButtonGroup}>
              <Button
                className={styles.submitButton}
                bgColor="#1E40AF"
                onClick={handleRegister}
              >
                CRIAR CONTA
              </Button>
            </ButtonGroup>
          </li>
        </ol>
      </main>
      <Toaster />
      <ThemeToggle />
    </div>
  )
}
