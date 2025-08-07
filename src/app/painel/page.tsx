'use client'

import styles from "../page.module.css";
import { Heading } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle"

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/");
    } else {
      setIsAuthorized(true); 
    }
  }, []);

  useEffect(() => {
      const toastRaw = localStorage.getItem('toast')
      if (toastRaw) {
          const toast = JSON.parse(toastRaw)
          localStorage.removeItem('toast')

          setTimeout(() => {
          toaster.create({
              ...toast,
              closable: true,
              duration: 5000
          })
          }, 0)
      }
  }, [])

   if (isAuthorized === null) return null;

  return (
    <div className={styles.page} style={{ maxWidth: "950px", margin: "0 auto"}}>
      <Heading size="2xl" style={{ margin: "30px auto", textAlign: "center"}}>EM CONSTRUÇÃO</Heading>
      <Toaster />
      <ThemeToggle />
    </div>
  )
}
