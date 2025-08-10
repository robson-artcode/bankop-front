'use client'

import styles from "../page.module.css";
import {
  Grid,
  GridItem,
  Text,
  Skeleton,
  FormatNumber,
  Tabs,
  Card,
  Heading,
  Timeline,
  Icon,
  Box,
} from "@chakra-ui/react";
import { LuArrowRightLeft, LuCircleArrowRight } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useEffect, useState, useCallback } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { OpCoinConvert } from "../components/OpCoinConvert";
import Image from "next/image";
import { ConversionModalContent } from "../components/ConversionModalContent";
import { TransferModalContent } from "../components/TransferModelContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setBrlCoins,
  setOpCoins,
  setOpCoinsToConvert,
} from "../store/conversionSlice";
import { setTransactions } from "../store/transactionSlice";
import { Logout } from "../components/Logout";

// Importar variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL as string || "http://localhost:3333";

// Tipagem Wallet
interface Wallet {
  id: string;
  balance: number;
  coin: {
    symbol: string;
    name: string;
  };
}

// Tipagem para as transações (simplificada)
interface TransactionUser {
  id: string;
  email: string;
  name: string;
}

interface TransactionCoin {
  id: string;
  symbol: string;
  name: string;
}

interface TransactionType {
  id: string;
  type: string;
  description: string;
}


interface Transaction {
  id: string;
  fromCoin: TransactionCoin;
  toCoin: TransactionCoin;
  amountFrom: number;
  amountTo: number;
  userId: string;
  userFrom: TransactionUser;
  userTo: TransactionUser;
  type: TransactionType;
  createdAt: string;
}

// Função para formatar data em pt-BR com hora am/pm
const formatCustomDate = (dateInput: Date): string => {
  if (!(dateInput instanceof Date)) {
    dateInput = new Date(dateInput);
  }
  
  if (isNaN(dateInput.getTime())) {
    return 'Data inválida';
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateInput);

  const hours = dateInput.getHours();
  const minutes = dateInput.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours % 12 || 12;

  return `${formattedDate}, ${hours12}:${minutes}${period}`;
};


export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Estados locais
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  // Estados do redux
  const opCoinBalance = useSelector((state: RootState) => state.conversion.opCoins);
  const brlCoinBalance = useSelector((state: RootState) => state.conversion.brlCoins);
  const transactions = useSelector((state: RootState) => state.transaction.transactions);

  // Função para buscar wallets
  const loadWallets = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/wallets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Falha ao carregar os saldos");

      const data: Wallet[] = await response.json();

      // Extrair saldos específicos
      const opCoinWallet = data.find((w) => w.coin.symbol === "OPCOIN");
      const brlWallet = data.find((w) => w.coin.symbol === "BRL");

      dispatch(setOpCoinsToConvert(0));
      dispatch(setOpCoins(opCoinWallet?.balance || 0));
      dispatch(setBrlCoins(brlWallet?.balance || 0));

      setWallets(data);
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: "Falha ao carregar os saldos",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  }, [dispatch]);

  // Função para buscar transações
  const loadTransactions = useCallback(async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao carregar as transações");

    const data: Transaction[] = await response.json();

    // Converte string para Date
    const dataWithDates = data.map(tx => ({
      ...tx,
      createdAt: tx.createdAt,
    }));

    dispatch(setTransactions(dataWithDates));
  } catch (error) {
      toaster.create({
        title: "Erro",
        description: "Falha ao carregar as transações",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  }, [dispatch]);


  // Efeito principal para carregar dados e autenticação
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/");
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(true);

      try {
        await Promise.all([loadWallets(token), loadTransactions(token)]);
      } catch {
        // Erro tratado dentro das funções fetch
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, loadWallets, loadTransactions]);

  // Exibir toast salvo no localStorage
  useEffect(() => {
    const toastRaw = localStorage.getItem("toast");
    if (toastRaw) {
      const toast = JSON.parse(toastRaw);
      localStorage.removeItem("toast");

      setTimeout(() => {
        toaster.create({
          ...toast,
          closable: true,
          duration: 5000,
        });
      }, 0);
    }
  }, []);

  // Simula loading da conversão (se necessário)
  useEffect(() => {
    if (isConverting) {
      const timer = setTimeout(() => {
        setIsConverting(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConverting]);

  if (isAuthenticated === null) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 30px" }}>
      {isLoading ? (
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
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {/* Wallets - Tabs */}
            <GridItem>
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
            </GridItem>

            {/* Produtos */}
            <GridItem order={{ base: 3, md: 2 }} colSpan={{ base: 1, md: 2 }}>
              <Card.Root>
                <Card.Header>
                  <Heading size="lg">Nossos Produtos</Heading>
                </Card.Header>
                <Card.Body>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                    <Card.Root
                      cursor="pointer"
                      onClick={() =>
                        OpCoinConvert.open("a", {
                          title: "Conversão de Pontos",
                          description: "Faça a conversão dos seus pontos agora mesmo. A cada 5 pontos, você receberá 1 real.",
                          content: <ConversionModalContent onClose={() => OpCoinConvert.close("a")} />,
                        })
                      }
                    >
                      <Card.Header>
                        <Icon size="xl">
                          <LuArrowRightLeft />
                        </Icon>
                      </Card.Header>
                      <Card.Body>
                        <Heading size="md">Conversão de Pontos</Heading>
                      </Card.Body>
                      <Card.Footer>Converta seus pontos em Reais</Card.Footer>
                    </Card.Root>

                    <Card.Root
                      cursor="pointer"
                      onClick={() =>
                        OpCoinConvert.open("a", {
                          title: "Transferência",
                          description: "Escolha a moeda que deseja transferir, sua quantidade, e-mail do usuário e realize a transferência",
                          content: <TransferModalContent onClose={() => OpCoinConvert.close("a")} />,
                        })
                      }
                    >
                      <Card.Header>
                        <Icon size="xl">
                          <LuCircleArrowRight />
                        </Icon>
                      </Card.Header>
                      <Card.Body>
                        <Heading size="md">Transferências</Heading>
                      </Card.Body>
                      <Card.Footer>Faça transferências de pontos ou reais para outros usuários</Card.Footer>
                    </Card.Root>
                  </Grid>
                </Card.Body>
              </Card.Root>
            </GridItem>

            {/* Últimas transações */}
            <GridItem order={{ base: 2, md: 1 }}>
              <Card.Root>
                <Card.Header>
                  <Heading size="lg">Últimas transações</Heading>
                </Card.Header>
                <Card.Body>
                  <Box
                    maxH="300px"
                    overflowY="auto"
                    css={{
                      "&::-webkit-scrollbar": {
                        width: "4px",
                      },
                      "&::-webkit-scrollbar-track": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#3182CE",
                        borderRadius: "24px",
                      },
                    }}
                  >
                    <Timeline.Root>
                      {isLoading ? (
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                          {[...Array(4)].map((_, idx) => (
                            <GridItem key={idx}>
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
                                {transaction.type.type === "CONVERT" ? <LuArrowRightLeft /> : null}
                                {transaction.type.type === "TRANSFER" ? <LuCircleArrowRight /> : null}
                              </Timeline.Indicator>
                            </Timeline.Connector>
                            <Timeline.Content>
                              <Timeline.Title>{transaction.type.description}</Timeline.Title>
                              <Timeline.Description>
                                {formatCustomDate(new Date(transaction.createdAt))}
                              </Timeline.Description>
                              <Text textStyle="sm">
                                {transaction.type.type === "CONVERT" && (
                                  <>
                                    {transaction.type.description} de{" "}
                                    <strong>
                                      {transaction.amountFrom} {transaction.fromCoin.symbol}
                                    </strong>{" "}
                                    para <strong>{transaction.amountTo} {transaction.toCoin.symbol}</strong>
                                  </>
                                )}
                                {transaction.type.type === "TRANSFER" && transaction.userId === transaction.userFrom.id && (
                                  <>
                                    Você fez uma transferência de{" "}
                                    <strong>
                                      {transaction.amountFrom} {transaction.fromCoin.symbol}
                                    </strong>{" "}
                                    para <strong>{transaction.userTo.email}</strong>
                                  </>
                                )}
                                {transaction.type.type === "TRANSFER" && transaction.userId !== transaction.userFrom.id && (
                                  <>
                                    Você recebeu uma transferência de{" "}
                                    <strong>
                                      {transaction.amountTo} {transaction.toCoin.symbol}
                                    </strong>{" "}
                                    de <strong>{transaction.userFrom.email}</strong>
                                  </>
                                )}
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
            </GridItem>
          </Grid>
        </>
      ) : (
        <Text textAlign="center" mt={8}>
          Nenhum saldo encontrado
        </Text>
      )}

      <Toaster />
      <ThemeToggle />
      <Logout />
      <OpCoinConvert.Viewport />
    </div>
  );
}
