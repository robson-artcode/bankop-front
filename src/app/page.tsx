'use client'

import { useState, useEffect } from 'react'
import { Box, Flex, useBreakpointValue, Field, Input, Button } from '@chakra-ui/react'
import { Toaster, toaster } from '../components/ui/toaster'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '../components/ThemeToggle'
import { PasswordInput } from '../components/ui/password-input'
import { CtaSection } from './components/CtaSection'
import { LogoHeader } from './components/LogoHeader'
import styles from './page.module.css'

interface FormState {
  email: string // Valor do campo e-mail
  password: string // Valor do campo senha
  emailError: string // Mensagem de erro para e-mail
  passwordError: string // Mensagem de erro para senha
  isLoading: boolean // Estado de carregamento
  authStatus: 'loading' | 'unauthorized' | 'authorized' | null // Status de autenticação
  touched: {
    email: boolean // Se o campo e-mail foi interagido
    password: boolean // Se o campo senha foi interagido
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex para validação de e-mail
const DEBOUNCE_DELAY = 500 // Tempo de debounce para validação (ms)

/**
 * Valida um campo específico do formulário
 * 
 * @param field - Campo a ser validado ('email' ou 'password')
 * @param value - Valor atual do campo
 * @returns Mensagem de erro ou string vazia se válido
 */
const validateField = (
  field: 'email' | 'password',
  value: string
): string => {
  if (field === 'email') {
    if (!value) return 'E-mail é obrigatório'
    if (!EMAIL_REGEX.test(value)) return 'E-mail inválido'
  } else if (field === 'password') {
    if (!value) return 'Senha é obrigatória'
    if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
  }
  return ''
}

/**
 * Componente de campo de e-mail
 * 
 * @param value - Valor atual do campo
 * @param onChange - Handler para mudanças no campo
 * @param onBlur - Handler para quando o campo perde o foco
 * @param error - Mensagem de erro (se houver)
 * @returns Componente de campo de e-mail
 */
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

/**
 * Componente de campo de senha
 * 
 * @param value - Valor atual do campo
 * @param onChange - Handler para mudanças no campo
 * @param onBlur - Handler para quando o campo perde o foco
 * @param error - Mensagem de erro (se houver)
 * @returns Componente de campo de senha
 */
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

/**
 * Componente de formulário de login
 * 
 * @param email - Valor atual do e-mail
 * @param password - Valor atual da senha
 * @param onEmailChange - Handler para mudanças no e-mail
 * @param onPasswordChange - Handler para mudanças na senha
 * @param onSubmit - Handler para submissão do formulário
 * @param isLoading - Indica se o login está em processamento
 * @returns Componente de formulário de login
 */
const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading
}: {
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}) => {
  const [formState, setFormState] = useState<{
    emailError: string
    passwordError: string
    touched: { email: boolean; password: boolean }
  }>({
    emailError: '',
    passwordError: '',
    touched: { email: false, password: false }
  })

  // Validação debounced para e-mail
  useEffect(() => {
    if (!formState.touched.email) return

    const timer = setTimeout(() => {
      const emailError = validateField('email', email)
      setFormState((prev) => ({ ...prev, emailError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [email, formState.touched.email])

  // Validação debounced para senha
  useEffect(() => {
    if (!formState.touched.password) return

    const timer = setTimeout(() => {
      const passwordError = validateField('password', password)
      setFormState((prev) => ({ ...prev, passwordError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [password, formState.touched.password])

  /**
   * Marca campo como tocado ao perder o foco
   * 
   * @param field - Campo que perdeu o foco ('email' ou 'password')
   */
  const handleBlur = (field: 'email' | 'password') => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }))
  }

  return (
    <Box as="form" width="100%" onSubmit={onSubmit}>
      <Flex direction="column" gap={4}>
        <EmailField
          value={email}
          onChange={onEmailChange}
          onBlur={() => handleBlur('email')}
          error={formState.emailError}
        />
        <PasswordField
          value={password}
          onChange={onPasswordChange}
          onBlur={() => handleBlur('password')}
          error={formState.passwordError}
        />
        <Button
          type="submit"
          width="100%"
          backgroundColor="#1E40AF"
          marginTop={"6"}
          color={{ base: 'white', _dark: 'white' }}
          textTransform="uppercase"
          size="lg"
          height="48px"
          disabled={!!formState.emailError || !!formState.passwordError || isLoading}
          loading={isLoading}
          loadingText="ENTRANDO..."
        >
          ENTRAR
        </Button>
      </Flex>
    </Box>
  )
}

/**
 * Página inicial da aplicação
 * 
 * Exibe:
 * - Formulário de login
 * - Seção de CTA para cadastro
 * - Componentes globais (Toaster, ThemeToggle)
 * 
 * @returns Componente da página inicial
 */
export default function HomePage() {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    isLoading: false,
    authStatus: null,
    touched: { email: false, password: false }
  })

  // Verifica autenticação ao carregar a página
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

  // Exibe notificações salvas no localStorage
  useEffect(() => {
    const storedToastData = localStorage.getItem('toast')
    if (storedToastData) {
      const parsedToastData = JSON.parse(storedToastData)
      toaster.create({
        ...parsedToastData,
        closable: true,
        duration: 5000
      })
      localStorage.removeItem('toast')
    }
  }, [])

  /**
   * Atualiza valores dos campos do formulário
   * 
   * @param field - Campo a ser atualizado ('email' ou 'password')
   * @param value - Novo valor do campo
   */
  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Processa o login do usuário
   * 
   * @param e - Evento de formulário
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState((prev) => ({
      ...prev,
      isLoading: true,
      touched: { email: true, password: true }
    }))

    // Valida campos
    const emailError = validateField('email', formState.email)
    const passwordError = validateField('password', formState.password)

    setFormState((prev) => ({ ...prev, emailError, passwordError }))

    if (emailError || passwordError) {
      setFormState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formState.email, password: formState.password })
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        toaster.create({
          title: 'Erro no login',
          description: errorResponse.message || 'Credenciais inválidas',
          type: 'error',
          duration: 5000,
          closable: true
        })
        return
      }

      const { access_token, user } = await response.json()
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user_name', user.name)
      localStorage.setItem('user_email', user.email)

      localStorage.setItem(
        'toast',
        JSON.stringify({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo ao painel da BankOp!',
          type: 'success'
        })
      )

      router.push('/painel')
    } catch (err) {
      console.error('Erro na requisição de login:', err)
      toaster.create({
        title: 'Erro inesperado',
        description: 'Tente novamente mais tarde.',
        type: 'error',
        duration: 5000,
        closable: true
      })
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  /**
   * Redireciona para página de cadastro
   */
  const handleSignUp = () => {
    router.push('/criar-conta')
  }

  // Não renderiza nada enquanto verifica autenticação
  if (formState.authStatus === null) return null

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
        direction={isMobile ? 'column' : 'row'}
        justify="center"
        align="center"
        gap="4rem"
      >
        {/* Coluna de login */}
        <Box
          width={isMobile ? '100%' : '50%'}
          maxWidth="500px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding="2rem"
        >
          <LogoHeader />
          <LoginForm
            email={formState.email}
            password={formState.password}
            onEmailChange={(value) => handleInputChange('email', value)}
            onPasswordChange={(value) => handleInputChange('password', value)}
            onSubmit={handleLogin}
            isLoading={formState.isLoading}
          />
        </Box>

        {/* Coluna de CTA */}
        <Box
          width={isMobile ? '100%' : '50%'}
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
  )
}