'use client'

import { useState } from 'react'
import { Button, Field, Input, Text, Box } from '@chakra-ui/react'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useDispatch, useSelector } from 'react-redux'
import { setBrlCoins, setOpCoins } from '../../../store/conversionSlice'
import { setNewTransactions } from '../../../store/transactionSlice'
import { RootState } from '../../../store'
import { FormatNumber } from '@chakra-ui/react'

interface ConversionModalProps {
  onClose: () => void // Função para fechar o modal
}

interface FormState {
  opCoinsInput: string // Valor digitado pelo usuário para conversão
  isLoading: boolean // Estado de carregamento durante a conversão
  amountError: string // Mensagem de erro para o valor
}

interface ValidationResult {
  isValid: boolean // Indica se o valor é válido
  amountError: string // Mensagem de erro detalhada
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const CONVERSION_RATE = 5 // Taxa fixa de conversão: 1 BRL = 5 OpCoins

/**
 * Valida o valor de OpCoins informado para conversão
 * 
 * @param opCoinsInput - Valor digitado pelo usuário
 * @param maxOpCoins - Saldo máximo disponível em OpCoins
 * @returns Objeto com resultado da validação
 */
const validateAmount = (opCoinsInput: string, maxOpCoins: number): ValidationResult => {
  const amount = Number(opCoinsInput)
  let amountError = ''

  // Validações do valor informado
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

/**
 * Componente para entrada de OpCoins a serem convertidos
 * 
 * @param value - Valor atual do campo
 * @param onChange - Função chamada ao alterar o valor
 * @param error - Mensagem de erro (se houver)
 * @param disabled - Se o campo está desabilitado
 * @returns Componente de campo de entrada
 */
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
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Permite apenas números inteiros (sem pontos decimais)
    const regex = /^[0-9]*$/;
    
    if (inputValue === '' || regex.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <Field.Root required invalid={!!error}>
      <Field.Label>
        OpCoins <Field.RequiredIndicator />
      </Field.Label>
      <Input
        disabled={disabled}
        placeholder="Quantidade de OpCoins"
        value={value}
        onChange={handleChange}
        type="text"
        inputMode="numeric"
      />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      <Field.HelperText>Digite o total de OpCoins que deseja converter</Field.HelperText>
    </Field.Root>
  );
};

/**
 * Componente para exibição do saldo convertido em tempo real
 * 
 * @param opCoinsInput - Valor em OpCoins sendo convertido
 * @returns Componente de exibição do saldo
 */
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

/**
 * Modal para conversão de OpCoins em BRL
 * 
 * Gerencia todo o processo de conversão de moedas virtuais,
 * incluindo validação, requisição à API, atualização do estado global
 * e suporte a submissão via Enter.
 * 
 * @param onClose - Função para fechar o modal
 * @returns Componente de modal de conversão
 */
export function ConversionModal({ onClose }: ConversionModalProps) {
  const dispatch = useDispatch()
  const { opCoins } = useSelector((state: RootState) => state.conversion)
  const [formState, setFormState] = useState<FormState>({
    opCoinsInput: '',
    isLoading: false,
    amountError: ''
  })

  /**
   * Atualiza o valor do campo de entrada com validação em tempo real
   * 
   * @param value - Novo valor digitado
   */
  const handleInputChange = (value: string) => {
    const { amountError } = validateAmount(value, opCoins)
    setFormState((prev) => ({ ...prev, opCoinsInput: value, amountError }))
  }

  /**
   * Processa a conversão de OpCoins para BRL
   */
  const handleConvert = async () => {
    const { isValid, amountError } = validateAmount(formState.opCoinsInput, opCoins)
    setFormState((prev) => ({ ...prev, amountError, isLoading: isValid }))

    if (!isValid) return

    try {
      const token = localStorage.getItem('access_token')
      const opCoinsToConvert = Number(formState.opCoinsInput)
      
      // Requisição para API de conversão
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
      
      // Atualiza os estados globais com os novos valores
      dispatch(setOpCoins(data.updatedOpCoinBalance))
      dispatch(setBrlCoins(data.updatedBRLCoinBalance))
      dispatch(setNewTransactions(data.newTransaction))

      // Feedback visual para o usuário
      toaster.create({
        title: 'Conversão realizada',
        description: `Você converteu ${opCoinsToConvert} OpCoins com sucesso!`,
        type: 'success',
        duration: 5000,
        closable: true
      })

      onClose()
    } catch (error) {
      // Tratamento de erros
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
      <form onSubmit={(e) => { e.preventDefault(); handleConvert(); }}>
        {/* Campo para entrada de OpCoins */}
        <OpCoinsField
          value={formState.opCoinsInput}
          onChange={handleInputChange}
          error={formState.amountError}
          disabled={formState.isLoading}
        />
        
        {/* Visualização do saldo convertido */}
        <BalanceDisplay opCoinsInput={formState.opCoinsInput} />
        
        {/* Botão de conversão */}
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
          loadingText="CONVERTENDO..."
          disabled={!formState.opCoinsInput || formState.isLoading || !!formState.amountError}
          _hover={{ backgroundColor: '#153082' }}
          _disabled={{ opacity: 0.7, cursor: 'not-allowed' }}
        >
          CONVERTER
        </Button>
      </form>
      
      {/* Componente para exibição de notificações */}
      <Toaster />
    </Box>
  )
}