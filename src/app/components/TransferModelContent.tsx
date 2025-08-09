'use client'

import { useState } from 'react'
import { Button, Field, Input, For, Stack, Select, Portal, createListCollection } from '@chakra-ui/react'
import { BeatLoader } from "react-spinners"
import { Toaster, toaster } from "@/components/ui/toaster"
import { RealTimeCurrencyConverter } from './RealTimeCurrencyConverter'
import { useDispatch, useSelector } from 'react-redux'
import { setBrlCoins, setOpCoins } from '../store/conversionSlice'
import { setNewTransactions, setTransactions } from '../store/transactionSlice'
import { RootState } from '../store'

interface TransferModalContentProps {
  onClose: () => void
}

export function TransferModalContent({ onClose }: TransferModalContentProps) {
  const dispatch = useDispatch()
  const [convertLoading, setConvertLoading] = useState(false);
  const [userToTransfer, setUserToTransfer] = useState("");
  const [amountCoin, setAmountCoin] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [disabledInput, setDisabledInput] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
    //   dispatch(setOpCoinsToConvert(Number(value)))
        setAmountCoin(Number(value));
    }
  }

  const frameworks = createListCollection({
        items: [
            { label: "Op Coin", value: "OPCOIN"},
            { label: "Real Brasileiro", value: "BRL"}
        ],
    })

  const handleValueChange = (details: { value: string[] }) => {
    setSelectedCurrency(details.value);
  };

  const getSelectedValue = () => selectedCurrency[0] || null;

  console.log(selectedCurrency)

  const handleTransfer = async () => {
    try {
      
      setConvertLoading(true)

      const token = localStorage.getItem('access_token');

      const res = await fetch('http://localhost:3333/wallets/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            email: userToTransfer,
            amountCoin: selectedCurrency[0],
            amount: amountCoin,
        }),
      })

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`)
      }

      const data = await res.json()

      if(data.amountCoin === "BRL"){
        dispatch(setBrlCoins(data.newBalance))
      } else if(data.amountCoin === "OPCOIN"){
         dispatch(setOpCoins(data.newBalance))
      }

      console.log(data.newTransaction)

      dispatch(setNewTransactions(data.newTransaction))

      toaster.create({
        title: "Transferência realizada",
        description: `Você transferiu ${data.amount} ${data.amountCoin} com sucesso!`,
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
        <Field.Root required>
            <Field.Label>
            E-mail <Field.RequiredIndicator />
            </Field.Label>
            <Input
                disabled={disabledInput}
                placeholder="E-mail do usuário"
                value={userToTransfer}
                onChange={(e) => setUserToTransfer(e.target.value)}
                type="text"
                inputMode="decimal"
            />
            <Field.HelperText>Digite o e-mail do usuário que deseja transferir o valor</Field.HelperText>
        </Field.Root>
        <Field.Root>
      <Select.Root 
        collection={frameworks} 
        size="sm"
        value={selectedCurrency}
        onValueChange={handleValueChange}
      >
        <Select.HiddenSelect name="currency" />
        <Select.Label>Moeda</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText 
              placeholder="Selecione uma moeda"
            />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      <Field.HelperText>Selecione a moeda de transferência</Field.HelperText>
      
      {/* Exibição do valor selecionado */}
      {selectedCurrency.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          Moeda selecionada: {getSelectedValue()}
        </div>
      )}
    </Field.Root>
        <Field.Root required>
            <Field.Label>
            Quantidade <Field.RequiredIndicator />
            </Field.Label>
            <Input
                disabled={disabledInput}
                placeholder="Quantidade de OpCoins"
                value={amountCoin}
                onChange={handleInputChange}
                type="text"
                inputMode="decimal"
            />
            <Field.HelperText>Digite a quantidade que deseja transferir</Field.HelperText>
        </Field.Root>
        <Button
            width={"full"}
            colorPalette="cyan"
            onClick={handleTransfer}
            spinner={<BeatLoader size={8} color="white" />}
            loading={convertLoading}
        >
            Transferir
        </Button>
        <Toaster/>
    </>
  )
}
