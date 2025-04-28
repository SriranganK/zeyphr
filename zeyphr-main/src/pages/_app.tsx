import "../../globals.css";
import type { AppProps } from "next/app";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider} from "@/context/CartContext";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProductProvider>
      <CartProvider>
        <Navbar />
      <Component {...pageProps} />
      <Footer />
      </CartProvider>
    </ProductProvider>
  );
}

export default MyApp;
