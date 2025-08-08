'use client'

import { FormatNumber, Input, Field, Text } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { setOpCoinsToConvert } from '../store/conversionSlice'
import { RootState } from '../store'

interface RealTimeCurrencyConverterProps {
  disableInput?: boolean
}

export function RealTimeCurrencyConverter({ disableInput = false }: RealTimeCurrencyConverterProps) {
  const dispatch = useDispatch()
  const opCoins = useSelector((state: RootState) => state.conversion.opCoinsToConvert)
  const CONVERSION_RATE = 5 

  const convertedValue = opCoins / CONVERSION_RATE

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      dispatch(setOpCoinsToConvert(Number(value)))
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
          value={opCoins || ''}
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
