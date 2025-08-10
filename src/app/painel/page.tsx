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
import { WalletCard } from "./components/WalletCard";
import { ProductsCard } from "./components/ProductsCard";
import { TransactionsCard } from "./components/TransactionsCard";
import { Wallet } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Estados locais
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do redux
  const opCoinBalance = useSelector((state: RootState) => state.conversion.opCoins);
  const brlCoinBalance = useSelector((state: RootState) => state.conversion.brlCoins);
  const transactions = useSelector((state: RootState) => state.transaction.transactions);

  // Funções para carregar dados
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
      const opCoinWallet = data.find((w) => w.coin.symbol === "OPCOIN");
      const brlWallet = data.find((w) => w.coin.symbol === "BRL");

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
      const data = await response.json();
      dispatch(setTransactions(data));
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

  // Efeitos
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, loadWallets, loadTransactions]);

  useEffect(() => {
    const toastRaw = localStorage.getItem("toast");
    if (toastRaw) {
      const toast = JSON.parse(toastRaw);
      localStorage.removeItem("toast");
      setTimeout(() => {
        toaster.create({ ...toast, closable: true, duration: 5000 });
      }, 0);
    }
  }, []);

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
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem order={{ base: 1, md: 1 }}>
            <WalletCard wallets={wallets} brlCoinBalance={brlCoinBalance} opCoinBalance={opCoinBalance} />
          </GridItem>

          <GridItem order={{ base: 2, md: 3 }} colSpan={{ base: 1, md: 2 }}>
            <ProductsCard />
          </GridItem>

          <GridItem order={{ base: 3, md: 2 }}>
            <TransactionsCard isLoading={isLoading} transactions={transactions} />
          </GridItem>
        </Grid>
      ) : (
        <Text textAlign="center" mt={8}>
          Nenhum saldo encontrado
        </Text>
      )}

      <Toaster />
      <ThemeToggle />
      <Logout />
      <OverlayManager.Viewport />
    </div>
  );
}