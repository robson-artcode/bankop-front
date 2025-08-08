'use client'

import { useState } from 'react'
import { FormatNumber, Input, Field, Text } from '@chakra-ui/react'

interface RealTimeCurrencyConverterProps {
  disableInput?: boolean // Adicione esta linha
  // ... outras props se existirem
}

export function RealTimeCurrencyConverter({ disableInput = false }: RealTimeCurrencyConverterProps) {
  const [inputValue, setInputValue] = useState('')
  const CONVERSION_RATE = 5 // 5 OpCoins = 1 Real

  const convertedValue = Number(inputValue) / CONVERSION_RATE

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Permite apenas números e um ponto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value)
    }
  }

  return (
    <>
      <Field.Root required>
        <Field.Label>
          OpCoins <Field.RequiredIndicator />
        </Field.Label>
        <Input
            disabled={disableInput}
          placeholder="Quantidade de OpCoins"
          value={inputValue}
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
    </>
  )
}