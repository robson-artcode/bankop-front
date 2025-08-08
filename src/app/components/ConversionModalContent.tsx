// components/ConversionModalContent.tsx
'use client'

import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { BeatLoader } from "react-spinners"
import { RealTimeCurrencyConverter } from './RealTimeCurrencyConverter'

export function ConversionModalContent() {
  const [convertLoading, setConvertLoading] = useState(false)

  const handleConvert = () => {
    setConvertLoading(true)
    // Simulação de chamada à API
    setTimeout(() => {
      setConvertLoading(false)
      alert('Conversão realizada com sucesso!')
    }, 2000)
  }

  return (
    <>
      <RealTimeCurrencyConverter disableInput={convertLoading}/>
      <Button
        loading={convertLoading}
        width={"full"}
        colorPalette="cyan"
        onClick={handleConvert}
        spinner={<BeatLoader size={8} color="white" />}
      >
        Converter
      </Button>
    </>
  )
}