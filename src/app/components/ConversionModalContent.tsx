'use client'

import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { BeatLoader } from "react-spinners"
import { Toaster, toaster } from "@/components/ui/toaster"
import { RealTimeCurrencyConverter } from './RealTimeCurrencyConverter'
import { useDispatch, useSelector } from 'react-redux'
import { setBrlCoins, setOpCoins } from '../store/conversionSlice'
import { setTransactions } from '../store/transactionSlice'
import { RootState } from '../store'

interface ConversionModalContentProps {
  onClose: () => void
}

export function ConversionModalContent({ onClose }: ConversionModalContentProps) {
  const dispatch = useDispatch()
  const [convertLoading, setConvertLoading] = useState(false)
  const opCoinsToConvert = useSelector((state: RootState) => state.conversion.opCoinsToConvert)

  const handleConvert = async () => {
    try {
      
      setConvertLoading(true)

      const token = localStorage.getItem('access_token');

      const res = await fetch('http://localhost:3333/wallets/convert', {
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

      dispatch(setOpCoins(data.updatedOpCoinBalance),)
      dispatch(setBrlCoins(data.updatedBRLCoinBalance))
      dispatch(setTransactions(data.newTransaction))

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
        description: "Erro ao realizar conversão.",
        type: "error",
        duration: 5000,
        closable: true
      })
    } finally {
      setConvertLoading(false)
    }
  }

  return (
    <>
      <RealTimeCurrencyConverter disableInput={convertLoading} />
      <Button
        width={"full"}
        colorPalette="cyan"
        onClick={handleConvert}
        spinner={<BeatLoader size={8} color="white" />}
        loading={convertLoading}
      >
        Converter
      </Button>
      <Toaster/>
    </>
  )
}
