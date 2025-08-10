'use client'

import { useEffect, useState } from 'react'
import { Button, Field, Input, Select, createListCollection } from '@chakra-ui/react'
import { BeatLoader } from "react-spinners"
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

// Validation logic extracted into a utility function
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

  // Validate email
  if (!email) {
    emailError = 'E-mail é obrigatório'
  } else if (!EMAIL_REGEX.test(email)) {
    emailError = 'E-mail inválido'
  } else if (email === currentUserEmail) {
    emailError = 'Não pode transferir para si mesmo'
  }

  // Validate currency
  if (currency.length === 0) {
    currencyError = 'Selecione uma moeda'
  }

  // Validate amount
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

// Email input component
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

// Currency selection component
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

// Amount input component
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

  // Load current user's email from localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem('user_email') || ''
    setFormState((prev) => ({ ...prev, currentUserEmail: userEmail }))
  }, [])

  // Handle email input changes
  const handleEmailChange = (value: string) => {
    setFormState((prev) => {
      const { isValid, emailError } = validateForm(
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

  // Handle currency selection changes
  const handleCurrencyChange = (value: string[]) => {
    setFormState((prev) => {
      const { isValid, currencyError, amountError } = validateForm(
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

  // Handle amount input changes
  const handleAmountChange = (value: number) => {
    setFormState((prev) => {
      const { isValid, amountError } = validateForm(
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

  // Handle form submission
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
        throw new Error(`Erro ${res.status}`)
      }

      const data = await res.json()

      // Update Redux store based on currency
      if (data.amountCoin === "BRL") {
        dispatch(setBrlCoins(data.newBalance))
      } else if (data.amountCoin === "OPCOIN") {
        dispatch(setOpCoins(data.newBalance))
      }

      dispatch(setNewTransactions(data.newTransaction))

      // Show success notification
      toaster.create({
        title: "Transferência realizada",
        description: `Você transferiu ${data.amount} ${data.amountCoin} com sucesso!`,
        type: "success",
        duration: 5000,
        closable: true
      })

      onClose()
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: "Erro ao realizar transferência.",
        type: "error",
        duration: 5000,
        closable: true
      })
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <>
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
        width="full"
        colorPalette="cyan"
        onClick={handleTransfer}
        spinner={<BeatLoader size={8} color="white" />}
        loading={formState.isLoading}
      >
        Transferir
      </Button>
      <Toaster />
    </>
  )
}