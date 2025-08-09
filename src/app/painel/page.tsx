'use client'

import styles from "../page.module.css";
import { Grid, GridItem, Text, Skeleton, FormatNumber, Tabs, Card, Heading, Timeline, Icon, Box } from "@chakra-ui/react"
import { LuCheck, LuPackage, LuShip, LuArrowRightLeft, LuCircleArrowRight } from "react-icons/lu"
import { useRouter } from "next/navigation";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle"
import { OpCoinConvert } from "../components/OpCoinConvert";
import Image from "next/image";
import { ConversionModalContent } from "../components/ConversionModalContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../store'
import { setBrlCoins, setOpCoins, setOpCoinsToConvert } from "../store/conversionSlice";
import { setTransactions } from "../store/transactionSlice";
interface Wallet {
  id: string;
  balance: number;
  coin: {
    symbol: string;
    name: string;
  };
}

interface transactionType {
    id: string
    fromCoinId: string,
    toCoinId: string,
    amountFrom: number
    amountTo: number
    createdAt: Date
}

const formatCustomDate = (dateInput: Date): string => {
    const date = new Date(dateInput);
  
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    const formatoData = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'pm' : 'am';
    const hours12 = hours % 12 || 12;

    return `${formatoData}, ${hours12}:${minutes}${period}`;
};


export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertLoading, setConvertLoading] = useState(false);
  const opCoins = useSelector((state: RootState) => state.conversion.opCoins)
  const brlCoins = useSelector((state: RootState) => state.conversion.brlCoins)
  const transactions: transactionType[] = useSelector((state: RootState) => state.transaction.transactions)
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        router.push("/");
        return;
      }

      setIsAuthorized(true);
      setLoading(true);

      try {
        await Promise.all([
          fetchWallets(token),
          fetchTransactions(token)
        ]);
      } catch (error) {
        toaster.create({
          title: "Erro",
          description: "Falha ao carregar dados",
          type: "error",
          duration: 5000,
          closable: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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

  useEffect(() => {
  if (convertLoading) {
      setTimeout(() => {
        setConvertLoading(false)
      }, 2000)
    }
  }, [convertLoading])

  const fetchWallets = async (token: string) => {
    try {
      
      const response = await fetch('http://localhost:3333/wallets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os saldos');
      }

      const data = await response.json();
      console.log(data)
      const opCoins = data.find((state: any) => state.coin.symbol === "OPCOIN");
      const brlCoins = data.find((state: any) => state.coin.symbol === "BRL");

      dispatch(setOpCoinsToConvert(0));
      dispatch(setOpCoins(opCoins.balance));
      dispatch(setBrlCoins(brlCoins.balance));

      setWallets(data);
      
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: "Falha ao carregar os saldos",
        type: "error",
        duration: 5000,
        closable: true
      });
    }
  };

  const fetchTransactions = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3333/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os saldos');
      }

      const data = await response.json();
   
      dispatch(setTransactions(data))
      
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: "Falha ao carregar as transações",
        type: "error",
        duration: 5000,
        closable: true
      });
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
                            <FormatNumber value={brlCoins} style="currency" currency="BRL" /> : 
                            <span>OPC <FormatNumber value={opCoins}/></span>
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
                <Heading size="lg">Últimas transações</Heading>
              </Card.Header>
              <Card.Body>
                <Box 
                  maxW="400px"
                  maxH="300px"
                  overflowY="auto"
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#3182CE',
                      borderRadius: '24px',
                    },
                  }}
                >
                  <Timeline.Root maxW="400px">
                    {loading ? ( 
                      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                        {[...Array(4)].map((_, index) => (
                          <GridItem key={index}>
                            <Skeleton height="20px" mb="4" />
                            <Skeleton height="20px" width="80%" />
                          </GridItem>
                        ))}
                      </Grid>
                    ) : transactions.length > 0 ? ( 
                      transactions.map((transaction) => (
                        <Timeline.Item key={transaction.id}>
                          <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator>
                              <LuArrowRightLeft />
                            </Timeline.Indicator>
                          </Timeline.Connector>
                          <Timeline.Content>
                            <Timeline.Title>Conversão</Timeline.Title>
                            <Timeline.Description>
                              {formatCustomDate(new Date(transaction.createdAt))}
                            </Timeline.Description>
                            <Text textStyle="sm">
                              Conversão de <strong>{transaction.amountFrom} OP</strong> para{' '}
                              <strong>{transaction.amountTo} BRL</strong>
                            </Text>
                          </Timeline.Content>
                        </Timeline.Item>
                      ))
                    ) : ( 
                      <Text textAlign="center" mt={8}>
                        Nenhuma transação encontrada
                      </Text>
                    )}
                  </Timeline.Root>
                </Box>
              </Card.Body>
            </Card.Root>
          </Grid>

          <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={6}>
            <Card.Root>
              <Card.Header>
                <Heading size="lg">Nossos Produtos</Heading>
              </Card.Header>
              <Card.Body>
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  <Card.Root
                    cursor={"pointer"} 
                    onClick={() => {
                      OpCoinConvert.open("a", {
                        title: "Conversão de Pontos",
                        description: "Faça a conversão dos seus pontos agora mesmo. A cada 5 pontos, você receberá 1 real.",
                        content: (
                            <ConversionModalContent onClose={() => OpCoinConvert.close("a")} />
                        )
                      })
                    }}
                  >
                    <Card.Header>
                      <Icon size="xl">
                        <LuArrowRightLeft/>
                      </Icon>
                    </Card.Header>
                    <Card.Body>
                      <Heading size="md">Conversão de Pontos</Heading>
                    </Card.Body>
                    <Card.Footer>Converta seus pontos em Reais</Card.Footer>
                  </Card.Root>
                </Grid>
              </Card.Body>
            </Card.Root>
          </Grid>
        </>
      ) : (
        <Text textAlign="center" mt={8}>Nenhum saldo encontrado</Text>
      )}

      <Toaster />
      <ThemeToggle />
      <OpCoinConvert.Viewport />
    </div>
  );
}