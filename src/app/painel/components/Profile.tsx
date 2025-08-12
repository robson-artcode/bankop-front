'use client'

import { Card, Badge, Stack, Box } from "@chakra-ui/react";
import { LuUserRoundCog } from "react-icons/lu";
import { OverlayManager } from "./modal/OverlayManager";
import { ProfileModal } from "./modal/ProfileModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

/**
 * Componente que exibe o perfil do investidor atual como um badge colorido,
 * junto com um botão para abrir o modal de configuração do perfil.
 * 
 * Integra com Redux para obter o perfil atual e exibe o modal para editar/excluir o perfil.
 * 
 * @returns JSX.Element
 */
export const ProfileCard = () => {
    // Obtém o perfil do investidor do estado global Redux
    const investorProfile = useSelector((state: RootState) => state.profile.profile);

    return (
        <Card.Root>
            <Card.Body>
                <Stack direction="row" gap={2} align="center">
                    <Badge>Perfil Investidor:</Badge>
                    {(investorProfile === "conservador") &&
                        <Badge colorPalette="green">{investorProfile}</Badge>
                    }
                    {(investorProfile === "moderado") &&
                        <Badge colorPalette="blue">{investorProfile}</Badge>
                    }
                    {(investorProfile === "arrojado") &&
                        <Badge colorPalette="yellow">{investorProfile}</Badge>
                    }
                    {(investorProfile === null) &&
                        <Badge colorPalette="gray">nenhum</Badge>
                    }
                    <Box
                        as="button"
                        aria-label="Configurações do perfil"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg={{ base: "gray.100", _dark: "gray.700" }}
                        color={{ base: "gray.600", _dark: "gray.200" }}
                        borderRadius="full"
                        p={2}
                        fontSize="xl"
                        _hover={{
                            bg: { base: "gray.200", _dark: "gray.600" },
                            transform: "scale(1.1)",
                            transition: "all 0.2s"
                        }}
                        _active={{ transform: "scale(0.95)" }}
                        ml="auto"
                        cursor="pointer"
                        onClick={() =>
                            OverlayManager.open("a", {
                                title: "Perfil de Investidor",
                                description: "Adicione, edite ou remova seu perfil de investidor, para que futuramente possamos indicá-lo os melhores investimentos.",
                                content: <ProfileModal onClose={() => OverlayManager.close("a")} />,
                            })
                        }
                    >
                        <LuUserRoundCog />
                    </Box>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};
