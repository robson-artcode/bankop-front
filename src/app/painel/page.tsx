'use client'

import { Grid, GridItem, Skeleton, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useEffect, useState, useCallback } from "react";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Logout } from "./components/Logout";
import { OverlayManager } from "./components/modal/OverlayManager";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setBrlCoins, setOpCoins } from "../store/conversionSlice";
import { setTransactions } from "../store/transactionSlice";
import { setProfile } from "../store/profileSlice";
import { WalletCard } from "./components/WalletCard";
import { ProductsCard } from "./components/ProductsCard";
import { TransactionsCard } from "./components/TransactionsCard";
import { Wallet } from "./types";
import { ProfileCard } from "./components/Profile";


// URL da API obtida das variáveis de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

/**
 * Página principal do dashboard do usuário
 * 
 * Gerencia a autenticação, carrega os dados das carteiras e transações,
 * e renderiza os componentes principais da interface
 * 
 * @returns JSX.Element
 */
export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Estados locais
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Estado de autenticação
  const [wallets, setWallets] = useState<Wallet[]>([]); // Lista de carteiras do usuário
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  // Estados do Redux
  const opCoinBalance = useSelector((state: RootState) => state.conversion.opCoins); // Saldo em OP Coin
  const brlCoinBalance = useSelector((state: RootState) => state.conversion.brlCoins); // Saldo em BRL
  const transactions = useSelector((state: RootState) => state.transaction.transactions); // Lista de transações
  
  /**
   * Carrega as carteiras do usuário a partir da API
   * 
   * @param token - Token de autenticação JWT
   */
  const loadWallets = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/wallets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw await response.json();
      }

      const data: Wallet[] = await response.json();
      const opCoinWallet = data.find((w) => w.coin.symbol === "OPCOIN");
      const brlWallet = data.find((w) => w.coin.symbol === "BRL");

      // Atualiza os estados no Redux
      dispatch(setOpCoins(opCoinWallet?.balance || 0));
      dispatch(setBrlCoins(brlWallet?.balance || 0));
      setWallets(data);
    } catch (error) {
      const message = (typeof error === 'object' && error !== null && 'message' in error) 
      ? error.message 
      : "Falha ao carregar os saldos";
      // Exibe mensagem de erro em caso de falha
      toaster.create({
        title: "Erro",
        description: message,
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  }, [dispatch]);

  /**
   * Carrega as transações do usuário a partir da API
   * 
   * @param token - Token de autenticação JWT
   */
  const loadTransactions = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw await response.json();
      }
      const data = await response.json();
      dispatch(setTransactions(data));
    } catch (error) {
       const message = (typeof error === 'object' && error !== null && 'message' in error) 
      ? error.message 
      : "Falha ao carregar as transações";
      // Exibe mensagem de erro em caso de falha
      toaster.create({
        title: "Erro",
        description: message,
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  }, [dispatch]);


  /**
   * Carrega o perfil do usuário a partir da API
   * 
   * @param token - Token de autenticação JWT
   */
  const loadProfile = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw await response.json();
      }
      const data = await response.json();

      dispatch(setProfile(data.profile));
    } catch (error) {
       const message = (typeof error === 'object' && error !== null && 'message' in error) 
      ? error.message 
      : "Falha ao carregar o perfil do usuário";
      // Exibe mensagem de erro em caso de falha
      toaster.create({
        title: "Erro",
        description: message,
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  }, [dispatch]);

  // Efeitos colaterais
  useEffect(() => {
    /**
     * Função para carregar os dados iniciais do dashboard
     */
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        // Redireciona para login se não houver token
        router.push("/");
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(true);
      try {
        // Carrega carteiras e transações em paralelo
        await Promise.all([
          loadWallets(token),
          loadTransactions(token),
          loadProfile(token)
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, loadWallets, loadTransactions, loadProfile]);

  useEffect(() => {
    /**
     * Verifica se há mensagens toast armazenadas e as exibe
     */
    const toastRaw = localStorage.getItem("toast");
    if (toastRaw) {
      const toast = JSON.parse(toastRaw);
      localStorage.removeItem("toast");
      setTimeout(() => {
        toaster.create({ ...toast, closable: true, duration: 5000 });
      }, 0);
    }
  }, []);

  // Retorna null enquanto verifica autenticação
  if (isAuthenticated === null) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 30px" }}>
      {isLoading ? (
        // Exibe esqueletos de carregamento enquanto os dados são buscados
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {[...Array(4)].map((_, index) => (
            <GridItem key={index}>
              <Skeleton height="20px" mb="4" />
              <Skeleton height="20px" width="80%" />
            </GridItem>
          ))}
        </Grid>
      ) : wallets.length > 0 ? (
        // Layout principal do dashboard
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {/* Card de carteiras */}
          <GridItem order={{ base: 1, md: 1 }}>
            <WalletCard wallets={wallets} brlCoinBalance={brlCoinBalance} opCoinBalance={opCoinBalance} />
            <GridItem marginTop={6}>
              <ProfileCard />
            </GridItem>
          </GridItem>

          {/* Card de produtos */}
          <GridItem order={{ base: 2, md: 3 }} colSpan={{ base: 1, md: 2 }}>
            <ProductsCard />
          </GridItem>

          {/* Card de transações */}
          <GridItem order={{ base: 3, md: 2 }}>
            <TransactionsCard isLoading={isLoading} transactions={transactions} />
          </GridItem>
        </Grid>
      ) : (
        // Mensagem exibida quando não há carteiras
        <Text textAlign="center" mt={8}>
          Nenhum saldo encontrado
        </Text>
      )}

      {/* Componentes globais */}
      <Toaster />
      <ThemeToggle />
      <Logout />
      <OverlayManager.Viewport />
    </div>
  );
}