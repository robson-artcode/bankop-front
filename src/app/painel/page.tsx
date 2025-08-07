'use client'

import styles from "../page.module.css";
import { Heading } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
import { useEffect } from "react";

export default function Home() {
 
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

  return (
    <div className={styles.page} style={{ maxWidth: "950px", margin: "0 auto"}}>
      <Heading size="2xl" style={{ margin: "30px auto", textAlign: "center"}}>EM CONSTRUÇÃO</Heading>
      <Toaster />
    </div>
  )
}
