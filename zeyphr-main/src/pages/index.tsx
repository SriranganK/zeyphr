import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import ActionCardGrid from "../components/ActionCards";
import ProductCardList from "../components/ProductCardList";
import "../../globals.css";
import "./style.css";
import { getWalletBalance } from "@/utils/balance";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

interface JwtPayload {
  exp: number; // expiry timestamp (seconds)
  iat: number; // issued at timestamp
  userId?: string; // example field
  email?: string; // example field
}

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [balance, setBalance] = useState<string>("0");
  const router = useRouter();

  useEffect(() => {
    const validateSession = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // no token, redirect
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Check if expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired");
          localStorage.removeItem("token");
          router.push("/login"); // token expired, redirect
          return;
        }

        console.log("Session valid:", decoded);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        router.push("/login"); // invalid token, redirect
      }
    };

    const fetchBalance = async () => {
      let res = await getWalletBalance(process.env.NEXT_PUBLIC_KEY || "");
      setBalance(res);
    };

    validateSession();
    fetchBalance();
  }, [router]);

  return (
    <div className="container mx-auto">
      <Banner />
      <ActionCardGrid balance={balance} />
      <ProductCardList />
    </div>
  );
}
