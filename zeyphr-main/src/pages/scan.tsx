import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../styles/scan.css"; // make sure to import the new CSS

export default function ScanPay() {
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 350, height: 350 } },
      false
    );

    scanner.render(
      (result) => {
        scanner.clear(); // stop scanning
        if (isValidUrl(result)) {
          router.push(result); // if valid URL, redirect
        } else {
          alert("Scanned code is not a URL!");
        }
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, []);

  const isValidUrl = (str: string) => {
    const pattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    return pattern.test(str);
  };

  return (
    <div className="scan-page">
      <div className="scan-card">
        <div className="scan-title">Scan QR Code</div>
        <div id="reader"></div>
        <button className="cancel-button" onClick={() => router.push("/home")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
