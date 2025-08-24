'use client'

import { Badge, Box, Button, Card, createListCollection, Field, Select, Stack, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { setProfile } from '../../../store/profileSlice'
import { Toaster, toaster } from "@/components/ui/toaster"

interface FormState {
    profile: string[]
    profileError: string
    isLoading: boolean
}

interface ValidationResult {
    isValid: boolean
    profileError: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

const PERFIS = createListCollection({
    items: [
        { label: "Conservador", value: "conservador" },
        { label: "Moderado", value: "moderado" },
        { label: "Arrojado", value: "arrojado" }
    ]
})

/**
 * Valida os campos do formulário de perfil
 * @param profile Array com perfil(s) selecionado(s)
 * @returns Objeto contendo isValid e mensagem de erro (se houver)
 */
const validateForm = (profile: string[]): ValidationResult => {
    let profileError = ''

    if (profile.length === 0) {
        profileError = 'Selecione um perfil'
    }

    return {
        isValid: !profileError,
        profileError
    }
}

/**
 * Componente para seleção do perfil do usuário
 * @param value Valor atual selecionado (array com um perfil)
 * @param onChange Callback para atualizar valor selecionado
 * @param error Mensagem de erro para validação
 * @param isLoading Estado de carregamento para desabilitar o campo
 * @returns JSX.Element do campo select com opções de perfil
 */
const ProfileSelectorField = ({
    value,
    onChange,
    error,
    isLoading
}: {
    value: string[]
    onChange: (value: string[]) => void
    error: string
    isLoading: boolean
}) => (
    <Field.Root required invalid={!!error}>
        <Select.Root
            collection={PERFIS}
            size="sm"
            value={value}
            onValueChange={(details) => onChange(details.value)}
            disabled={isLoading}
        >
            <Select.HiddenSelect name="profile" />
            <Select.Label>Perfil <Field.RequiredIndicator /></Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Selecione o perfil" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
                <Select.Content>
                    {PERFIS.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                            {item.label}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Positioner>
        </Select.Root>
        {error && <Field.ErrorText>{error}</Field.ErrorText>}
        <Field.HelperText>Selecione o seu perfil atual para ser adicionado</Field.HelperText>
        {value.length > 0 && (
            <div style={{ marginTop: '8px' }}>
                Perfil selecionado: {value[0]}
            </div>
        )}
    </Field.Root>
)

/**
 * Componente que exibe o perfil atual do usuário com badge colorido e botão para exclusão
 * @param value Array com perfil atual selecionado
 * @param onDelete Callback para excluir o perfil atual
 * @returns JSX.Element exibindo o perfil atual com botão de exclusão
 */
const ProfileActualField = ({
    value,
    onDelete
}: {
    value: string[]
    onDelete: () => void
}) => (
    <Field.Root>
        <Field.Label marginTop={6}>
            Perfil atual:
        </Field.Label>
        <Card.Root width="full">
            <Card.Body>
                <Stack direction="column" gap={4} width="full">
                    <Stack direction="row" gap={2} align="center" width="full">
                        <Field.Label flex="1">
                            {value?.[0] === "conservador" && (
                                <Badge colorPalette="green">{value[0]}</Badge>
                            )}
                            {value?.[0] === "moderado" && (
                                <Badge colorPalette="blue">{value[0]}</Badge>
                            )}
                            {value?.[0] === "arrojado" && (
                                <Badge colorPalette="yellow">{value[0]}</Badge>
                            )}
                            {!value?.[0] && (
                                <Badge colorPalette="gray">nenhum</Badge>
                            )}
                        </Field.Label>
                        <Box ml="auto">
                            <Button
                                size="xs"
                                colorPalette="red"
                                onClick={onDelete}
                            >
                                Excluir
                            </Button>
                        </Box>
                    </Stack>
                </Stack>
            </Card.Body>
        </Card.Root>
    </Field.Root>
)

/**
 * Componente modal para gerenciar perfil do usuário
 * Permite selecionar, atualizar e excluir o perfil investidor,
 * integrando com a API e atualizando o estado global Redux.
 * 
 * @param onClose Callback para fechar o modal
 * @returns JSX.Element do modal com formulário para perfil
 */
export function ProfileModal({ onClose }: { onClose: () => void }) {
    const dispatch = useDispatch()
    const profile = useSelector((state: RootState) => state.profile.profile)

    const profileValue: string =
        Array.isArray(profile) ? profile[0] :
            typeof profile === 'string' ? profile :
                'nenhum'

    const [formState, setFormState] = useState<FormState>({
        profile: profileValue !== 'nenhum' ? [profileValue] : [],
        profileError: '',
        isLoading: false
    })
    const [profileActual, setProfileActual] = useState<string[]>(
        profileValue !== 'nenhum' ? [profileValue] : []
    )

    /**
     * Atualiza o estado do perfil selecionado com validação
     * @param value Novo valor selecionado no select
     */
    const handleProfileSelectorChange = (value: string[]) => {
        setFormState((prev) => {
            const { profileError } = validateForm(value)
            return { ...prev, profile: value, profileError }
        })
    }

    /**
     * Envia o perfil para API (POST ou PUT) e atualiza estado global e local
     * @param e Evento de submit do formulário
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { isValid, profileError } = validateForm(formState.profile)
        setFormState((prev) => ({ ...prev, profileError, isLoading: isValid }))

        if (!isValid) return

        try {
            const token = localStorage.getItem('access_token')
            const method = profileActual.length > 0 ? 'PUT' : 'POST'
            const res = await fetch(`${API_URL}/users/profile`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ profile: formState.profile[0] })
            })

            if (!res.ok) {
                throw new Error('Falha ao atualizar perfil')
            }

            dispatch(setProfile(formState.profile[0]))
            setProfileActual([formState.profile[0]])

            toaster.create({
                title: "Perfil atualizado",
                description: `Seu perfil foi atualizado para ${formState.profile[0]}`,
                type: "success",
                duration: 5000,
                closable: true
            })

            setTimeout(() => onClose(), 500)
        } catch (error) {
            toaster.create({
                title: "Erro",
                description: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
                type: "error",
                duration: 5000,
                closable: true
            })
            setFormState((prev) => ({ ...prev, isLoading: false }))
        }
    }

    /**
     * Exclui o perfil via API e atualiza estado global e local
     */
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('access_token')
            const res = await fetch(`${API_URL}/users/profile`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw new Error('Falha ao excluir perfil')
            }

            dispatch(setProfile(''))
            setProfileActual([])
            setFormState((prev) => ({ ...prev, profile: [] }))

            toaster.create({
                title: "Perfil removido",
                description: "Seu perfil foi excluído com sucesso",
                type: "success",
                duration: 5000,
                closable: true
            })
        } catch (error) {
            toaster.create({
                title: "Erro",
                description: error instanceof Error ? error.message : 'Erro ao excluir perfil',
                type: "error",
                duration: 5000,
                closable: true
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap={4}>
                <ProfileSelectorField
                    value={formState.profile}
                    onChange={handleProfileSelectorChange}
                    error={formState.profileError}
                    isLoading={formState.isLoading}
                />
                {profileActual.length > 0 && (
                    <ProfileActualField value={profileActual} onDelete={handleDelete} />
                )}
                <Button
                    type="submit"
                    width="100%"
                    backgroundColor="#1E40AF"
                    marginTop="6"
                    color={{ base: 'white', _dark: 'white' }}
                    textTransform="uppercase"
                    size="lg"
                    height="48px"
                    loading={formState.isLoading}
                    loadingText="ATUALIZANDO..."
                    disabled={formState.isLoading || !!formState.profileError}
                    _hover={{ backgroundColor: '#153082' }}
                    _disabled={{ opacity: 0.7, cursor: 'not-allowed' }}
                >
                    ATUALIZAR
                </Button>
            </Flex>
            <Toaster />
        </form>
    )
}
