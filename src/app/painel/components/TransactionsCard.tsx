'use client'

import { Card, Heading, Box, Text, Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { Timeline } from "@chakra-ui/react";
import { LuArrowRightLeft, LuCircleArrowRight } from "react-icons/lu";
import { Transaction } from "../types";
import { formatCustomDate } from "../../utils/date";

interface TransactionsCardProps {
  isLoading: boolean;
  transactions: Transaction[];
}

export const TransactionsCard = ({ isLoading, transactions }: TransactionsCardProps) => (
  <Card.Root>
    <Card.Header>
      <Heading size="lg">Últimas transações</Heading>
    </Card.Header>
    <Card.Body>
      <Box
        maxH="300px"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { background: "#3182CE", borderRadius: "24px" },
        }}
      >
        <Timeline.Root>
          {isLoading ? (
            <LoadingSkeleton />
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
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
);

const LoadingSkeleton = () => (
  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
    {[...Array(4)].map((_, idx) => (
      <GridItem key={idx}>
        <Skeleton height="20px" mb="4" />
        <Skeleton height="20px" width="80%" />
      </GridItem>
    ))}
  </Grid>
);

const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
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
        {renderTransactionDescription(transaction)}
      </Text>
    </Timeline.Content>
  </Timeline.Item>
);

const renderTransactionDescription = (transaction: Transaction) => {
  if (transaction.type.type === "CONVERT") {
    return (
      <>
        {transaction.type.description} de{" "}
        <strong>
          {transaction.amountFrom} {transaction.fromCoin.symbol}
        </strong>{" "}
        para <strong>{transaction.amountTo} {transaction.toCoin.symbol}</strong>
      </>
    );
  }

  if (transaction.type.type === "TRANSFER") {
    return transaction.userId === transaction.userFrom.id ? (
      <>
        Você fez uma transferência de{" "}
        <strong>
          {transaction.amountFrom} {transaction.fromCoin.symbol}
        </strong>{" "}
        para <strong>{transaction.userTo.email}</strong>
      </>
    ) : (
      <>
        Você recebeu uma transferência de{" "}
        <strong>
          {transaction.amountTo} {transaction.toCoin.symbol}
        </strong>{" "}
        de <strong>{transaction.userFrom.email}</strong>
      </>
    );
  }

  return null;
};