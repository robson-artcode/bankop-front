'use client'

import { useEffect, useState } from 'react'
import { Button, Field, Input, Select, createListCollection, Flex } from '@chakra-ui/react'
import { Toaster, toaster } from "@/components/ui/toaster"
import { useDispatch, useSelector } from 'react-redux'
import { setBrlCoins, setOpCoins } from '../../../store/conversionSlice'
import { setNewTransactions } from '../../../store/transactionSlice'
import { RootState } from '../../../store'

interface TransferModalProps {
  onClose: () => void
}

interface FormState {
  recipientEmail: string 
  amount: number
  currency: string[]
  isLoading: boolean
  emailError: string 
  currencyError: string 
  amountError: string 
  currentUserEmail: string
}

interface ValidationResult {
  isValid: boolean
  emailError: string 
  currencyError: string 
  amountError: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CURRENCIES = createListCollection({
  items: [
    { label: "Op Coin", value: "OPCOIN" },
    { label: "Real Brasileiro", value: "BRL" }
  ]
})

/**
 * Valida os campos do formulário de transferência
 * 
 * @param email - E-mail do destinatário
 * @param currency - Moeda selecionada
 * @param amount - Quantidade a transferir
 * @param currentUserEmail - E-mail do usuário atual
 * @param opCoins - Saldo em OP Coin
 * @param brlCoins - Saldo em BRL
 * @returns Objeto com resultados da validação
 */
const validateForm = (
  email: string,
  currency: string[],
  amount: number,
  currentUserEmail: string,
  opCoins: number,
  brlCoins: number
): ValidationResult => {
  let emailError = ''
  let currencyError = ''
  let amountError = ''

  // Validações para o campo de e-mail
  if (!email) {
    emailError = 'E-mail é obrigatório'
  } else if (!EMAIL_REGEX.test(email)) {
    emailError = 'E-mail inválido'
  } else if (email === currentUserEmail) {
    emailError = 'Não pode transferir para si mesmo'
  }

  // Validações para o campo de moeda
  if (currency.length === 0) {
    currencyError = 'Selecione uma moeda'
  }

  // Validações para o campo de quantidade
  if (amount <= 0) {
    amountError = 'A quantidade deve ser maior que 0'
  } else if (currency[0] === 'OPCOIN' && amount > opCoins) {
    amountError = `Quantidade excede o saldo disponível (${opCoins} OPCOIN)`
  } else if (currency[0] === 'BRL' && amount > brlCoins) {
    amountError = `Quantidade excede o saldo disponível (${brlCoins} BRL)`
  }

  return {
    isValid: !emailError && !currencyError && !amountError,
    emailError,
    currencyError,
    amountError
  }
}

/**
 * Componente para campo de e-mail do destinatário
 * 
 * @param value - Valor atual do campo
 * @param onChange - Função de callback quando o valor muda
 * @param error - Mensagem de erro (se houver)
 * @returns JSX.Element
 */
const EmailField = ({
  value,
  onChange,
  error
}: {
  value: string
  onChange: (value: string) => void
  error: string
}) => (
  <Field.Root invalid={!!error}>
    <Field.Label>E-mail do destinatário</Field.Label>
    <Input
      placeholder="exemplo@email.com"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="email"
    />
    {error && <Field.ErrorText>{error}</Field.ErrorText>}
  </Field.Root>
)

/**
 * Componente para seleção de moeda
 * 
 * @param value - Valor atual selecionado
 * @param onChange - Função de callback quando o valor muda
 * @param error - Mensagem de erro (se houver)
 * @returns JSX.Element
 */
const CurrencyField = ({
  value,
  onChange,
  error
}: {
  value: string[]
  onChange: (value: string[]) => void
  error: string
}) => (
  <Field.Root required invalid={!!error}>
    <Select.Root
      collection={CURRENCIES}
      size="sm"
      value={value}
      onValueChange={(details) => onChange(details.value)}
    >
      <Select.HiddenSelect name="currency" />
      <Select.Label>Moeda <Field.RequiredIndicator /></Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Selecione uma moeda" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {CURRENCIES.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
    {error && <Field.ErrorText>{error}</Field.ErrorText>}
    <Field.HelperText>Selecione a moeda de transferência</Field.HelperText>
    {value.length > 0 && (
      <div style={{ marginTop: '8px' }}>
        Moeda selecionada: {value[0]}
      </div>
    )}
  </Field.Root>
)

/**
 * Componente para campo de quantidade a transferir
 * 
 * @param value - Valor atual do campo
 * @param onChange - Função de callback quando o valor muda
 * @param error - Mensagem de erro (se houver)
 * @param disabled - Indica se o campo está desabilitado
 * @returns JSX.Element
 */
const AmountField = ({
  value,
  onChange,
  error,
  disabled
}: {
  value: number
  onChange: (value: number) => void
  error: string
  disabled: boolean
}) => (
  <Field.Root required invalid={!!error}>
    <Field.Label>
      Quantidade <Field.RequiredIndicator />
    </Field.Label>
    <Input
      disabled={disabled}
      placeholder="Quantidade"
      value={value}
      onChange={(e) => {
        const input = e.target.value
        if (/^\d*\.?\d*$/.test(input)) {
          onChange(Number(input))
        }
      }}
      type="text"
      inputMode="decimal"
    />
    {error && <Field.ErrorText>{error}</Field.ErrorText>}
    <Field.HelperText>Digite a quantidade que deseja transferir</Field.HelperText>
  </Field.Root>
)

/**
 * Modal para realizar transferências entre usuários
 * 
 * Gerencia o processo de transferência, incluindo validação, requisição à API,
 * atualização do estado global e suporte a submissão via Enter.
 * 
 * @param onClose - Função para fechar o modal
 * @returns JSX.Element
 */
export function TransferModal({ onClose }: TransferModalProps) {
  const dispatch = useDispatch()
  const { opCoins, brlCoins } = useSelector((state: RootState) => state.conversion)
  const [formState, setFormState] = useState<FormState>({
    recipientEmail: '',
    amount: 0,
    currency: [],
    isLoading: false,
    emailError: '',
    currencyError: '',
    amountError: '',
    currentUserEmail: ''
  })

  // Carrega o e-mail do usuário atual do localStorage ao montar o componente
  useEffect(() => {
    const userEmail = localStorage.getItem('user_email') || ''
    setFormState((prev) => ({ ...prev, currentUserEmail: userEmail }))
  }, [])

  /**
   * Atualiza o estado do campo de e-mail com validação
   * 
   * @param value - Novo valor do campo de e-mail
   */
  const handleEmailChange = (value: string) => {
    setFormState((prev) => {
      const { emailError } = validateForm(
        value,
        prev.currency,
        prev.amount,
        prev.currentUserEmail,
        opCoins,
        brlCoins
      )
      return { ...prev, recipientEmail: value, emailError }
    })
  }

  /**
   * Atualiza o estado da seleção de moeda com validação
   * 
   * @param value - Novo valor do campo de moeda
   */
  const handleCurrencyChange = (value: string[]) => {
    setFormState((prev) => {
      const { currencyError, amountError } = validateForm(
        prev.recipientEmail,
        value,
        prev.amount,
        prev.currentUserEmail,
        opCoins,
        brlCoins
      )
      return { ...prev, currency: value, currencyError, amountError }
    })
  }

  /**
   * Atualiza o estado do campo de quantidade com validação
   * 
   * @param value - Novo valor do campo de quantidade
   */
  const handleAmountChange = (value: number) => {
    setFormState((prev) => {
      const { amountError } = validateForm(
        prev.recipientEmail,
        prev.currency,
        value,
        prev.currentUserEmail,
        opCoins,
        brlCoins
      )
      return { ...prev, amount: value, amountError }
    })
  }

  /**
   * Realiza a transferência após validação dos campos
   */
  const handleTransfer = async () => {
    const { isValid, emailError, currencyError, amountError } = validateForm(
      formState.recipientEmail,
      formState.currency,
      formState.amount,
      formState.currentUserEmail,
      opCoins,
      brlCoins
    )

    setFormState((prev) => ({
      ...prev,
      emailError,
      currencyError,
      amountError,
      isLoading: isValid
    }))

    if (!isValid) return

    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${API_URL}/wallets/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formState.recipientEmail,
          amountCoin: formState.currency[0],
          amount: formState.amount
        })
      })

      if (!res.ok) {
        throw await res.json();
      }

      const data = await res.json()

      // Atualiza o estado global com o novo saldo
      if (data.amountCoin === "BRL") {
        dispatch(setBrlCoins(data.newBalance))
      } else if (data.amountCoin === "OPCOIN") {
        dispatch(setOpCoins(data.newBalance))
      }

      dispatch(setNewTransactions(data.newTransaction))

      // Exibe notificação de sucesso
      toaster.create({
        title: "Transferência realizada",
        description: `Você transferiu ${data.amount} ${data.amountCoin} com sucesso!`,
        type: "success",
        duration: 5000,
        closable: true
      })

      onClose()
    } catch (error) {
      const message = (typeof error === 'object' && error !== null && 'message' in error) 
        ? error.message 
        : "Erro ao realizar transferência";
      
      // Exibe notificação de erro
      toaster.create({
        title: "Erro",
        description: message,
        type: "error",
        duration: 5000,
        closable: true
      })
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleTransfer(); }}>
      <Flex direction="column" gap={4}>
        <EmailField
          value={formState.recipientEmail}
          onChange={handleEmailChange}
          error={formState.emailError}
        />
        <CurrencyField
          value={formState.currency}
          onChange={handleCurrencyChange}
          error={formState.currencyError}
        />
        <AmountField
          value={formState.amount}
          onChange={handleAmountChange}
          error={formState.amountError}
          disabled={formState.isLoading}
        />
        <Button
          type="submit"
          width="100%"
          backgroundColor="#1E40AF"
          marginTop="6"
          color={{ base: 'white', _dark: 'white' }}
          textTransform="uppercase"
          size="lg"
          height="48px"
          loading={formState.isLoading}
          loadingText="TRANSFERINDO..."
          disabled={!!formState.emailError || !!formState.currencyError || !!formState.amountError || formState.isLoading}
          _hover={{ backgroundColor: '#153082' }}
          _disabled={{ opacity: 0.7, cursor: 'not-allowed' }}
        >
          TRANSFERIR
        </Button>
      </Flex>
      <Toaster />
    </form>
  )
}