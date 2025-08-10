'use client'

import { useState, useEffect } from "react"
import { Input, Button, ButtonGroup, Heading, Box, Stack } from "@chakra-ui/react"
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
    <Box 
      className={styles.page} 
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding="2rem"
    >
      <Box 
        className={styles.main}
        width="100%"
        maxWidth="400px"
      >
        <Stack direction="column" gap={6} width="100%">
          <Heading size="2xl" textAlign="center" marginBottom={6}>
            Crie sua conta em alguns segundos
          </Heading>
          
          <Stack direction="column" gap={4} width="100%">
            <Input
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.formInput}
              size="lg"
            />
            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              size="lg"
            />
            <PasswordInput
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              size="lg"
            />
          </Stack>

          <ButtonGroup size="xl" width="100%" className={styles.formButtonGroup}>
            <Button
              width="100%"
              className={styles.submitButton}
              backgroundColor="#1E40AF"
              onClick={handleRegister}
              size="lg"
              height="48px"
            >
              CRIAR CONTA
            </Button>
          </ButtonGroup>
        </Stack>
      </Box>
      
      <Toaster />
      <ThemeToggle />
    </Box>
  )
}