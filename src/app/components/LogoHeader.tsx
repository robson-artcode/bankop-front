'use client';

import Image from "next/image";
import styles from "../page.module.css";

/**
 * Componente de cabeçalho com logo da BankOp
 * 
 * Exibe a logo da aplicação com dimensionamento responsivo e estilos pré-definidos.
 * Otimizado para performance com carregamento prioritário (priority).
 * 
 * @returns Componente de logo para cabeçalho
 */
export const LogoHeader = () => (
  <Image
    className={styles.logo}
    src="/bankop-logo.png" // Caminho da imagem na pasta public
    alt="Logo BankOp" // Texto alternativo para acessibilidade
    width={360} // Largura original da imagem (px)
    height={60} // Altura original da imagem (px)
    priority // Prioriza carregamento da imagem (Next.js optimization)
    style={{
      marginBottom: '1.1rem', // Espaçamento inferior
      marginLeft: "auto", // Centralização horizontal
      marginRight: "auto", // Centralização horizontal
      maxWidth: '342px', // Largura máxima responsiva
      width: "100%", // Largura fluída
      height: "auto" // Mantém proporção original
    }}
  />
);