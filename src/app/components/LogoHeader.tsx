'use client';

import Image from "next/image";
import styles from "../page.module.css";

export const LogoHeader = () => (
  <Image
    className={styles.logo}
    src="/bankop-logo.png"
    alt="Logo BankOp"
    width={360}
    height={60}
    priority
    style={{
      marginBottom: '1.1rem',
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: `342px`,
      width: "100%"
    }}
  />
);