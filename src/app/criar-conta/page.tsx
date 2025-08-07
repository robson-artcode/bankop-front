'use client'

import { useState, useEffect } from "react"
import { Input, Button, ButtonGroup, Heading } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation'
import { PasswordInput } from "@/components/ui/password-input"
import styles from "../page.module.css"

export default function Home() {
  
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        router.push("/painel");
      } else {
        setIsAuthorized(false); 
      }
    }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3333/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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

  if (isAuthorized === null) return null;

  return (
    <div className={styles.page} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <main className={styles.main}>
        <Heading size="2xl" textAlign="center">Crie sua conta em alguns segundos</Heading>
        <ol>
          <li>
            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ margin: "15px auto" }}
            />
            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ margin: "15px auto" }}
            />
            <PasswordInput
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ margin: "15px auto" }}
            />
          </li>
          <li>
            <ButtonGroup size="xl" style={{ margin: "15px auto", width: "100%" }}>
              <Button style={{ width: "100%" }} colorScheme="blue" onClick={handleSubmit}>
                CRIAR CONTA
              </Button>
            </ButtonGroup>
          </li>
        </ol>
      </main>
      <Toaster />
    </div>
  )
}
