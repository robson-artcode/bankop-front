'use client'

import { Card, Heading, Grid, Icon } from "@chakra-ui/react";
import { LuArrowRightLeft, LuCircleArrowRight } from "react-icons/lu";
import { OverlayManager } from "./modal/OverlayManager";
import { ConversionModal } from "./modal/ConversionModal";
import { TransferModal } from "./modal/TransferModel";

export const ProductsCard = () => (
  <Card.Root>
    <Card.Header>
      <Heading size="lg">Nossos Produtos</Heading>
    </Card.Header>
    <Card.Body>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
        <Card.Root
          cursor="pointer"
          onClick={() =>
            OverlayManager.open("a", {
              title: "Conversão de Pontos",
              description: "Faça a conversão dos seus pontos agora mesmo. A cada 5 pontos, você receberá 1 real.",
              content: <ConversionModal onClose={() => OverlayManager.close("a")} />,
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
            OverlayManager.open("a", {
              title: "Transferência",
              description: "Escolha a moeda que deseja transferir, sua quantidade, e-mail do usuário e realize a transferência",
              content: <TransferModal onClose={() => OverlayManager.close("a")} />,
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
);