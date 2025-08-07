import { useState } from "react";
import {
  Input,
  InputGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputProps
} from "@chakra-ui/react";
import { InputRightElement } from "@chakra-ui/input";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface PasswordInputProps extends InputProps {
  label?: string;
  error?: string;
}

export const PasswordInput = ({ label, error, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Digite sua senha"
          {...props}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            variant="ghost"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};