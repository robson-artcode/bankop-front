'use client'

import { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '../../components/ThemeToggle'
import { RegisterForm } from './components/RegisterForm'
import styles from '../page.module.css'

interface FormState {
  fullName: string // Nome completo do usuário
  email: string // E-mail do usuário
  password: string // Senha do usuário
  nameError: string // Erro de validação do nome
  emailError: string // Erro de validação do e-mail
  passwordError: string // Erro de validação da senha
  authStatus: 'loading' | 'unauthorized' | 'authorized' // Estado de autenticação
  touched: {
    fullName: boolean // Se o campo nome foi tocado
    email: boolean // Se o campo e-mail foi tocado
    password: boolean // Se o campo senha foi tocado
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex para validar e-mail
const DEBOUNCE_DELAY = 500 // Tempo de debounce para validação (ms)

/**
 * Valida um campo específico do formulário
 * 
 * @param field - Campo a ser validado ('fullName', 'email' ou 'password')
 * @param value - Valor atual do campo
 * @returns Mensagem de erro ou string vazia se válido
 */
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

/**
 * Página de registro de novos usuários
 * 
 * Gerencia todo o processo de criação de conta, incluindo:
 * - Validação dos campos
 * - Verificação de autenticação existente
 * - Comunicação com a API
 * - Feedback visual ao usuário
 * 
 * @returns JSX.Element
 */
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
  const [isLoading, setIsLoading] = useState(false) // Estado para controlar o loading do botão

  /**
   * Efeito para verificar autenticação ao carregar a página
   * Redireciona usuários já autenticados para o painel
   */
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

  /**
   * Efeito para validação debounced do nome completo
   * Executa após o usuário parar de digitar por 500ms
   */
  useEffect(() => {
    if (!formState.touched.fullName) return

    const timer = setTimeout(() => {
      const nameError = validateField('fullName', formState.fullName)
      setFormState((prev) => ({ ...prev, nameError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [formState.fullName, formState.touched.fullName])

  /**
   * Efeito para validação debounced do e-mail
   * Executa após o usuário parar de digitar por 500ms
   */
  useEffect(() => {
    if (!formState.touched.email) return

    const timer = setTimeout(() => {
      const emailError = validateField('email', formState.email)
      setFormState((prev) => ({ ...prev, emailError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [formState.email, formState.touched.email])

  /**
   * Efeito para validação debounced da senha
   * Executa após o usuário parar de digitar por 500ms
   */
  useEffect(() => {
    if (!formState.touched.password) return

    const timer = setTimeout(() => {
      const passwordError = validateField('password', formState.password)
      setFormState((prev) => ({ ...prev, passwordError }))
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [formState.password, formState.touched.password])

  /**
   * Atualiza o estado do formulário quando um campo é alterado
   * 
   * @param field - Campo sendo alterado
   * @param value - Novo valor do campo
   */
  const handleInputChange = (
    field: 'fullName' | 'email' | 'password',
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Marca um campo como "tocado" quando perde o foco
   * 
   * @param field - Campo que perdeu o foco
   */
  const handleBlur = (field: 'fullName' | 'email' | 'password') => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }))
  }

  /**
   * Processa o envio do formulário de registro
   */
  const handleRegister = async () => {
    // Valida todos os campos antes de enviar
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

    // Não prossegue se houver erros
    if (nameError || emailError || passwordError) return

    setIsLoading(true) // Ativa o estado de loading

    try {
      // Requisição para API de registro
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

      // Processa resposta da API
      const { access_token, user } = await response.json()
      
      // Armazena dados do usuário no localStorage
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user_name', user.name)
      localStorage.setItem('user_email', user.email)

      // Configura mensagem de sucesso para exibir após redirecionamento
      localStorage.setItem(
        'toast',
        JSON.stringify({
          description: 'Conta criada com sucesso',
          type: 'success'
        })
      )

      // Redireciona para página inicial
      router.push('/')
    } catch (error) {
      void error;
      // Exibe mensagem de erro
      toaster.create({
        description: 'Erro ao criar conta',
        type: 'error',
        closable: true
      })
    } finally {
      setIsLoading(false) // Desativa o estado de loading
    }
  }

  // Não renderiza nada enquanto verifica autenticação
  if (formState.authStatus === 'loading') return null

  return (
    <Box
      className={styles.page}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding="2rem"
    >
      <Box
        className={styles.main}
        width="100%"
        maxWidth="400px"
        display="flex"
        flexDirection="column"
      >
        <RegisterForm
          fullName={formState.fullName}
          email={formState.email}
          password={formState.password}
          nameError={formState.nameError}
          emailError={formState.emailError}
          passwordError={formState.passwordError}
          onFullNameChange={(value) => handleInputChange('fullName', value)}
          onEmailChange={(value) => handleInputChange('email', value)}
          onPasswordChange={(value) => handleInputChange('password', value)}
          onFullNameBlur={() => handleBlur('fullName')}
          onEmailBlur={() => handleBlur('email')}
          onPasswordBlur={() => handleBlur('password')}
          onSubmit={handleRegister}
          isLoading={isLoading}
        />
      </Box>
      
      {/* Componentes globais */}
      <Toaster />
      <ThemeToggle />
    </Box>
  )
}