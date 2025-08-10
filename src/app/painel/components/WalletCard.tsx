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

export const WalletCard = ({ wallets, brlCoinBalance, opCoinBalance }: WalletCardProps) => (
  <Card.Root>
    <Tabs.Root defaultValue={wallets[0]?.id || ""} variant="plain">
      <Card.Header>
        <Tabs.List bg="bg.muted" rounded="l3" p={1}>
          {wallets.map((wallet) => (
            <Tabs.Trigger
              key={wallet.id}
              value={wallet.id}
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 px-3 py-1.5 text-sm rounded-md"
            >
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
              {wallet.coin.name}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
      </Card.Header>
      <Card.Body>
        {wallets.map((wallet) => (
          <Tabs.Content key={wallet.id} value={wallet.id} className="mt-4">
            <Box className="bg-card rounded-lg p-4 shadow-sm">
              <Text textStyle="md">Saldo</Text>
              <Text textStyle="2xl">
                {wallet.coin.symbol === "BRL" ? (
                  <FormatNumber value={brlCoinBalance} style="currency" currency="BRL" />
                ) : (
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