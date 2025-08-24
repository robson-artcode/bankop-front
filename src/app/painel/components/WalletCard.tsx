'use client'

import { Tabs, Card, Text, FormatNumber, Box } from "@chakra-ui/react";
import Image from "next/image";
import styles from "../../page.module.css";
import { Wallet } from "../types";

interface WalletCardProps {
  wallets: Wallet[];
  brlCoinBalance: number;
  opCoinBalance: number; 
}

/**
 * Componente que exibe as carteiras do usuário em um sistema de abas
 * 
 * @param wallets - Lista de carteiras disponíveis
 * @param brlCoinBalance - Saldo atual em BRL
 * @param opCoinBalance - Saldo atual em OP Coin
 * @returns JSX.Element
 */
export const WalletCard = ({ wallets, brlCoinBalance, opCoinBalance }: WalletCardProps) => (
  <Card.Root>
    {/* Sistema de abas para alternar entre carteiras */}
    <Tabs.Root 
      defaultValue={wallets[0]?.id || ""} // Primeira carteira como padrão
      variant="plain" // Estilo das abas
    >
      <Card.Header>
        {/* Lista de abas (uma para cada carteira) */}
        <Tabs.List bg="bg.muted" rounded="l3" p={1}>
          {wallets.map((wallet) => (
            <Tabs.Trigger
              key={wallet.id}
              value={wallet.id}
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 px-3 py-1.5 text-sm rounded-md"
            >
              {/* Ícone condicional baseado no tipo de moeda */}
              {wallet.coin.symbol === "BRL" ? (
                <Image
                  className={styles.logo}
                  src="/brasil-icon.png"
                  alt="Real Brasileiro - Logo"
                  width={22}
                  height={22}
                  priority
                />
              ) : (
                <Image
                  className={styles.logo}
                  src="/bankop-icon.png"
                  alt="Bankop - Logo"
                  width={22}
                  height={22}
                  priority
                />
              )}
              {wallet.coin.name} {/* Nome da moeda */}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator rounded="l2" /> {/* Indicador visual da aba ativa */}
        </Tabs.List>
      </Card.Header>

      {/* Conteúdo das abas */}
      <Card.Body>
        {wallets.map((wallet) => (
          <Tabs.Content 
            key={wallet.id} 
            value={wallet.id} 
            className="mt-4"
          >
            {/* Card de saldo */}
            <Box className="bg-card rounded-lg p-4 shadow-sm">
              <Text textStyle="md">Saldo</Text>
              <Text textStyle="2xl">
                {wallet.coin.symbol === "BRL" ? (
                  // Formatação monetária para BRL
                  <FormatNumber 
                    value={brlCoinBalance} 
                    style="currency" 
                    currency="BRL" 
                  />
                ) : (
                  // Formatação numérica simples para OP Coin
                  <>
                    OPC <FormatNumber value={opCoinBalance} />
                  </>
                )}
              </Text>
            </Box>
          </Tabs.Content>
        ))}
      </Card.Body>
    </Tabs.Root>
  </Card.Root>
);