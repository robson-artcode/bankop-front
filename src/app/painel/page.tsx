'use client'

import styles from "../page.module.css";
import { Grid, GridItem, Text, Skeleton, FormatNumber, Tabs, Card, Heading, Timeline } from "@chakra-ui/react"
import { LuCheck, LuPackage, LuShip } from "react-icons/lu"
import { useRouter } from "next/navigation";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle"
import Image from "next/image";

interface Wallet {
  id: string;
  balance: number;
  coin: {
    symbol: string;
    name: string;
  };
}

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/");
    } else {
      setIsAuthorized(true);
      fetchWallets(token);
    }
  }, []);

  useEffect(() => {
    const toastRaw = localStorage.getItem('toast');
    if (toastRaw) {
      const toast = JSON.parse(toastRaw);
      localStorage.removeItem('toast');

      setTimeout(() => {
        toaster.create({
          ...toast,
          closable: true,
          duration: 5000
        });
      }, 0);
    }
  }, []);

  const fetchWallets = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3333/wallets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(response)

      if (!response.ok) {
        throw new Error('Falha ao carregar os saldos');
      }

      const data = await response.json();
      console.log(data)
      setWallets(data);
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: "Falha ao carregar os saldos",
        type: "error",
        duration: 5000,
        closable: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized === null) return null;

  return (
    <div style={{ maxWidth: "950px", margin: "30px auto"}}>
      
      {loading ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {[...Array(4)].map((_, index) => (
              <GridItem key={index}>
                <Skeleton height="20px" mb="4" />
                <Skeleton height="20px" width="80%" />
              </GridItem>
            ))}
          </Grid>
        ) : wallets.length > 0 ? (
          <>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <Card.Root>
                <Tabs.Root defaultValue={wallets[0]?.id || ''} variant={"plain"}>
                  <Card.Header>
                    <Tabs.List bg="bg.muted" rounded="l3" p="1">
                      {wallets.map((wallet) => (
                        <Tabs.Trigger
                          key={wallet.id}
                          value={wallet.id}
                          className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 px-3 py-1.5 text-sm rounded-md"
                        >
                          {wallet.coin.symbol === 'BRL' ? 
                          <Image
                            className={styles.logo}
                            src="/brasil-icon.png"
                            alt="Real Brasileiro - Logo"
                            width={22}
                            height={22}
                            priority
                          /> : 
                          <Image
                            className={styles.logo}
                            src="/bankop-icon.png"
                            alt="Bankop - Logo"
                            width={22}
                            height={22}
                            priority
                          />}
                          {wallet.coin.name}
                        </Tabs.Trigger>
                      ))}
                      <Tabs.Indicator rounded="l2" />
                    </Tabs.List>
                  </Card.Header>
                  <Card.Body>
                    {wallets.map((wallet) => (
                      <Tabs.Content key={wallet.id} value={wallet.id} className="mt-4">
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                          <Text textStyle="md">Saldo</Text>
                          <Text textStyle="2xl">
                            {wallet.coin.symbol === 'BRL' ?
                              <FormatNumber value={wallet.balance} style="currency" currency="BRL" /> : <span>OPC <FormatNumber value={wallet.balance}/></span>
                            }
                          </Text>
                        </div>
                      </Tabs.Content>
                    ))}
                  </Card.Body>
                </Tabs.Root>
              </Card.Root>
              <Card.Root>
                <Card.Header>
                  <Heading size="lg">
                    Últimas transações
                  </Heading>
                </Card.Header>
                <Card.Body>
                  <Timeline.Root maxW="400px">

                    <Timeline.Item>
                      <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator>
                          <LuShip />
                        </Timeline.Indicator>
                      </Timeline.Connector>
                      <Timeline.Content>
                        <Timeline.Title>Product Shipped</Timeline.Title>
                        <Timeline.Description>13th May 2021</Timeline.Description>
                        <Text textStyle="sm">
                          We shipped your product via <strong>FedEx</strong> and it should
                          arrive within 3-5 business days.
                        </Text>
                      </Timeline.Content>
                    </Timeline.Item>

                    <Timeline.Item>
                      <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator>
                          <LuCheck />
                        </Timeline.Indicator>
                      </Timeline.Connector>
                      <Timeline.Content>
                        <Timeline.Title textStyle="sm">Order Confirmed</Timeline.Title>
                        <Timeline.Description>18th May 2021</Timeline.Description>
                      </Timeline.Content>
                    </Timeline.Item>

                    <Timeline.Item>
                      <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator>
                          <LuPackage />
                        </Timeline.Indicator>
                      </Timeline.Connector>
                      <Timeline.Content>
                        <Timeline.Title textStyle="sm">Order Delivered</Timeline.Title>
                        <Timeline.Description>20th May 2021, 10:30am</Timeline.Description>
                      </Timeline.Content>
                    </Timeline.Item>

                  </Timeline.Root>
                </Card.Body>
                <Card.Footer />
              </Card.Root>
            </Grid>
            <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={6}>
              <Card.Root>
                <Card.Header>
                  <Heading size="lg">
                    Nossos Produtos
                  </Heading>
                </Card.Header>
                <Card.Body>
                
                </Card.Body>
              </Card.Root>
            </Grid>
          </>
          
      ) : (
        <Text textAlign="center" mt={8}>Nenhum saldo encontrado</Text>
      )}

      <Toaster />
      <ThemeToggle />
    </div>
  );
}