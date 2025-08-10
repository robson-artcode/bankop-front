'use client'

import { useState } from 'react'
import { Button, Input, Field, Text, Box } from '@chakra-ui/react'
import { BeatLoader } from "react-spinners"
import { Toaster, toaster } from "@/components/ui/toaster"
import { useDispatch } from 'react-redux'
import { setBrlCoins, setOpCoins } from '../../../store/conversionSlice'
import { setNewTransactions } from '../../../store/transactionSlice'
import { FormatNumber } from '@chakra-ui/react'

interface ConversionModalProps {
  onClose: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const CONVERSION_RATE = 5;

export function ConversionModal({ onClose }: ConversionModalProps) {
  const dispatch = useDispatch()
  const [convertLoading, setConvertLoading] = useState(false)
  const [opCoinsInput, setOpCoinsInput] = useState<string>('')
  
  // Calcula o valor convertido em tempo real
  const convertedValue = opCoinsInput ? Number(opCoinsInput) / CONVERSION_RATE : 0

  const handleConvert = async () => {
    try {
      setConvertLoading(true)
      const opCoinsToConvert = Number(opCoinsInput)
      
      if (!opCoinsToConvert || opCoinsToConvert <= 0) {
        throw new Error("Valor inválido para conversão")
      }

      const token = localStorage.getItem('access_token')
      const res = await fetch(`${API_URL}/wallets/convert`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ opCoins: opCoinsToConvert }),
      })

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`)
      }

      const data = await res.json()
      dispatch(setOpCoins(data.updatedOpCoinBalance))
      dispatch(setBrlCoins(data.updatedBRLCoinBalance))
      dispatch(setNewTransactions(data.newTransaction))

      toaster.create({
        title: "Conversão realizada",
        description: `Você converteu ${opCoinsToConvert} OpCoins com sucesso!`,
        type: "success",
        duration: 5000,
        closable: true
      })

      if (onClose) onClose()
    
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao realizar conversão",
        type: "error",
        duration: 5000,
        closable: true
      })
    } finally {
      setConvertLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Valida se é um número válido (incluindo decimais)
    if (/^\d*\.?\d*$/.test(value)) {
      setOpCoinsInput(value)
    }
  }

  return (
    <Box>
      <Field.Root required>
        <Field.Label>
          OpCoins <Field.RequiredIndicator />
        </Field.Label>
        <Input
          disabled={convertLoading}
          placeholder="Quantidade de OpCoins"
          value={opCoinsInput}
          onChange={handleInputChange}
          type="text"
          inputMode="decimal"
        />
        <Field.HelperText>Digite o total de OpCoins que deseja converter</Field.HelperText>
      </Field.Root>
      
      <Text mt={4} textStyle="md">Seu novo saldo será:</Text>
      <Text textStyle="md">
        <FormatNumber 
          value={convertedValue} 
          style="currency" 
          currency="BRL"
        />
      </Text>

      <Button
        width="full"
        mt={4}
        colorScheme="blue"
        onClick={handleConvert}
        loading={convertLoading}
        loadingText="Convertendo..."
        spinner={<BeatLoader size={8} color="white" />}
        disabled={!opCoinsInput || convertLoading}
      >
        Converter
      </Button>

      <Toaster/>
    </Box>
  )
}