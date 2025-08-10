'use client'

import { useState, useEffect } from 'react'
import { Input, Button, ButtonGroup, Heading, Box, Stack, Field } from '@chakra-ui/react'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useRouter } from 'next/navigation'
import { PasswordInput } from '@/components/ui/password-input'
import { ThemeToggle } from '../../components/ThemeToggle'
import styles from '../page.module.css'

interface FormState {
  fullName: string
  email: string
  password: string
  nameError: string
  emailError: string
  passwordError: string
  authStatus: 'loading' | 'unauthorized' | 'authorized'
  touched: {
    fullName: boolean
    email: boolean
    password: boolean
  }
}

interface ValidationResult {
  nameError: string
  emailError: string
  passwordError: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEBOUNCE_DELAY = 500 // Delay in milliseconds for debouncing

// Validation logic for individual fields
const validateField = (
  field: 'fullName' | 'email' | 'password',
  value: string
): string => {
  if (field === 'fullName') {
    if (!value) return 'Nome é obrigatório'
    if (value.length < 3) return 'Nome deve ter pelo menos 3 caracteres'
  } else if (field === 'email') {
    if (!value) return 'E-mail é obrigatório'
    if (!EMAIL_REGEX.test(value)) return 'E-mail inválido'
  } else if (field === 'password') {
    if (!value) return 'Senha é obrigatória'
    if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
  }
  return ''
}

// Name input component
const NameField = ({
  value,
  onChange,
  onBlur,
  error
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error: string
}) => (
  <Field.Root required invalid={!!error}>
    <Field.Label>Nome completo</Field.Label>
    <Input
      placeholder="Nome completo"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={styles.formInput}
      size="lg"
    />
    {error && <Field.ErrorText>{error}</Field.ErrorText>}
  </Field.Root>
)

// Email input component
const EmailField = ({
  value,
  onChange,
  onBlur,
  error
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error: string
}) => (
  <Field.Root required invalid={!!error}>
    <Field.Label>E-mail</Field.Label>
    <Input
      placeholder="E-mail"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={styles.formInput}
      size="lg"
    />
    {error && <Field.ErrorText>{error}</Field.ErrorText>}
  </Field.Root>
)

// Password input component
const PasswordField = ({
  value,
  onChange,
  onBlur,
  error
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error: string
}) => (
  <Field.Root required invalid={!!error}>
    <Field.Label>Senha</Field.Label>
    <PasswordInput
      placeholder="Senha"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={styles.formInput}
      size="lg"
    />
    {error && <Field.ErrorText>{error}</Field.ErrorText>}
  </Field.Root>
)

export default function RegisterPage() {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    authStatus: 'loading',
    touched: {
      fullName: false,
      email: false,
      password: false
    }
  })

  // Check authorization status on mount
  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        router.push('/painel')
      } else {
        setFormState((prev) => ({ ...prev, authStatus: 'unauthorized' }))
      }
    }
    checkAuthorization()
  }, [router])

  // Debounced validation for fullName
  useEffect(() => {
    if (!formState.touched.fullName) return

    const timer = setTimeout(() => {
      const nameError = validateField('fullName', formState.fullName)
      setFormState((prev) => ({ ...prev, nameError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [formState.fullName, formState.touched.fullName])

  // Debounced validation for email
  useEffect(() => {
    if (!formState.touched.email) return

    const timer = setTimeout(() => {
      const emailError = validateField('email', formState.email)
      setFormState((prev) => ({ ...prev, emailError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [formState.email, formState.touched.email])

  // Debounced validation for password
  useEffect(() => {
    if (!formState.touched.password) return

    const timer = setTimeout(() => {
      const passwordError = validateField('password', formState.password)
      setFormState((prev) => ({ ...prev, passwordError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [formState.password, formState.touched.password])

  // Handle input changes
  const handleInputChange = (
    field: 'fullName' | 'email' | 'password',
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  // Handle input blur to mark field as touched
  const handleBlur = (field: 'fullName' | 'email' | 'password') => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }))
  }

  // Handle form submission
  const handleRegister = async () => {
    // Validate all fields on submission
    const nameError = validateField('fullName', formState.fullName)
    const emailError = validateField('email', formState.email)
    const passwordError = validateField('password', formState.password)

    setFormState((prev) => ({
      ...prev,
      nameError,
      emailError,
      passwordError,
      touched: {
        fullName: true,
        email: true,
        password: true
      }
    }))

    if (nameError || emailError || passwordError) return

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.fullName,
          email: formState.email,
          password: formState.password
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao criar conta')
      }

      const { access_token, user } = await response.json()
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user_name', user.name)
      localStorage.setItem('user_email', user.email)

      localStorage.setItem(
        'toast',
        JSON.stringify({
          description: 'Conta criada com sucesso',
          type: 'success'
        })
      )

      router.push('/')
    } catch (error) {
      toaster.create({
        description: 'Erro ao criar conta',
        type: 'error',
        closable: true
      })
    }
  }

  if (formState.authStatus === 'loading') return null

  return (
    <Box
      className={styles.page}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding="2rem"
    >
      <Box className={styles.main} width="100%" maxWidth="400px">
        <Stack direction="column" gap={6} width="100%">
          <Heading size="2xl" textAlign="center" marginBottom={6}>
            Crie sua conta em alguns segundos
          </Heading>
          <Stack direction="column" gap={4} width="100%">
            <NameField
              value={formState.fullName}
              onChange={(value) => handleInputChange('fullName', value)}
              onBlur={() => handleBlur('fullName')}
              error={formState.nameError}
            />
            <EmailField
              value={formState.email}
              onChange={(value) => handleInputChange('email', value)}
              onBlur={() => handleBlur('email')}
              error={formState.emailError}
            />
            <PasswordField
              value={formState.password}
              onChange={(value) => handleInputChange('password', value)}
              onBlur={() => handleBlur('password')}
              error={formState.passwordError}
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
              disabled={!!formState.nameError || !!formState.emailError || !!formState.passwordError}
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