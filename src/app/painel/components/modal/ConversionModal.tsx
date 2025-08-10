'use client'

import { useState } from 'react'
import { Button, Field, Input, Text, Box } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useDispatch, useSelector } from 'react-redux'
import { setBrlCoins, setOpCoins } from '../../../store/conversionSlice'
import { setNewTransactions } from '../../../store/transactionSlice'
import { RootState } from '../../../store'
import { FormatNumber } from '@chakra-ui/react'

interface ConversionModalProps {
  onClose: () => void
}

interface FormState {
  opCoinsInput: string
  isLoading: boolean
  amountError: string
}

interface ValidationResult {
  isValid: boolean
  amountError: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const CONVERSION_RATE = 5

// Validation logic for OpCoins input
const validateAmount = (opCoinsInput: string, maxOpCoins: number): ValidationResult => {
  const amount = Number(opCoinsInput)
  let amountError = ''

  if (!opCoinsInput || amount <= 0) {
    amountError = 'A quantidade deve ser maior que 0'
  } else if (amount > maxOpCoins) {
    amountError = `Quantidade excede o saldo disponível (${maxOpCoins} OPCOIN)`
  } else if (!/^\d*\.?\d*$/.test(opCoinsInput)) {
    amountError = 'Digite um valor numérico válido'
  }

  return {
    isValid: !amountError,
    amountError
  }
}

// OpCoins input component
const OpCoinsField = ({
  value,
  onChange,
  error,
  disabled
}: {
  value: string
  onChange: (value: string) => void
  error: string
  disabled: boolean
}) => (
  <Field.Root required invalid={!!error}>
    <Field.Label>
      OpCoins <Field.RequiredIndicator />
    </Field.Label>
    <Input
      disabled={disabled}
      placeholder="Quantidade de OpCoins"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="text"
      inputMode="decimal"
    />
    {error && <Field.ErrorText>{error}</Field.ErrorText>}
    <Field.HelperText>Digite o total de OpCoins que deseja converter</Field.HelperText>
  </Field.Root>
)

// Balance display component
const BalanceDisplay = ({ opCoinsInput }: { opCoinsInput: string }) => {
  const convertedValue = opCoinsInput ? Number(opCoinsInput) / CONVERSION_RATE : 0
  return (
    <>
      <Text mt={4} textStyle="md">Seu novo saldo será:</Text>
      <Text textStyle="md">
        <FormatNumber value={convertedValue} style="currency" currency="BRL" />
      </Text>
    </>
  )
}

export function ConversionModal({ onClose }: ConversionModalProps) {
  const dispatch = useDispatch()
  const { opCoins } = useSelector((state: RootState) => state.conversion)
  const [formState, setFormState] = useState<FormState>({
    opCoinsInput: '',
    isLoading: false,
    amountError: ''
  })

  // Handle input change with validation
  const handleInputChange = (value: string) => {
    const { amountError } = validateAmount(value, opCoins)
    setFormState((prev) => ({ ...prev, opCoinsInput: value, amountError }))
  }

  // Handle conversion submission
  const handleConvert = async () => {
    const { isValid, amountError } = validateAmount(formState.opCoinsInput, opCoins)
    setFormState((prev) => ({ ...prev, amountError, isLoading: isValid }))

    if (!isValid) return

    try {
      const token = localStorage.getItem('access_token')
      const opCoinsToConvert = Number(formState.opCoinsInput)
      const res = await fetch(`${API_URL}/wallets/convert`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ opCoins: opCoinsToConvert })
      })

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`)
      }

      const data = await res.json()
      dispatch(setOpCoins(data.updatedOpCoinBalance))
      dispatch(setBrlCoins(data.updatedBRLCoinBalance))
      dispatch(setNewTransactions(data.newTransaction))

      toaster.create({
        title: 'Conversão realizada',
        description: `Você converteu ${opCoinsToConvert} OpCoins com sucesso!`,
        type: 'success',
        duration: 5000,
        closable: true
      })

      onClose()
    } catch (error) {
      toaster.create({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao realizar conversão',
        type: 'error',
        duration: 5000,
        closable: true
      })
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <Box>
      <OpCoinsField
        value={formState.opCoinsInput}
        onChange={handleInputChange}
        error={formState.amountError}
        disabled={formState.isLoading}
      />
      <BalanceDisplay opCoinsInput={formState.opCoinsInput} />
      <Button
        width="full"
        mt={4}
        colorScheme="blue"
        onClick={handleConvert}
        loading={formState.isLoading}
        loadingText="Convertendo..."
        spinner={<BeatLoader size={8} color="white" />}
        disabled={!formState.opCoinsInput || formState.isLoading || !!formState.amountError}
      >
        Converter
      </Button>
      <Toaster />
    </Box>
  )
}