import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getContract } from "@/utils/contract";
import { ethers } from "ethers";
import "../styles/productList.css";

const contract = getContract();

interface Product {
  tokenId: number;
  price: string;
  seller: string;
  buyer: string;
  sold: boolean;
  listed: boolean;
  tokenURI: string;
  image: string;
  name: string;
  desc: string;
}

const ProductCardList = () => {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    const fetchListedItems = async () => {
      const total = await contract.getTotalNfts();
      const listedItems: Product[] = [];

      for (let i = 1; i <= total; i++) {
        try {
          const itemData = await contract.getItems(i).catch(() => null);
          const tokenURI = await contract.tokenURI(i);

          if (itemData?.listed && !itemData.sold) {
            let image = "";
            let name = "";
            let desc = "";
            try {
              const res = await fetch(tokenURI);
              const metadata = await res.json();
              image = metadata.image;
              name = metadata.name;
              desc = metadata.description;
            } catch (err) {
              console.error(`Failed to fetch metadata for token ${i}:`, err);
            }

            listedItems.push({
              tokenId: i,
              price: itemData.price.toString(),
              seller: itemData.seller,
              buyer: itemData.buyer,
              sold: itemData.sold,
              listed: itemData.listed,
              tokenURI,
              image,
              name,
              desc,
            });
          }
        } catch (err) {
          console.log(`Error fetching item ${i}:`, err);
        }
      }

      setProducts(listedItems);
    };

    fetchListedItems();
  }, []);

  const router = useRouter();
  const openProductInfo = (productId: number) => {
    window.open(`/product?productId=${productId}`, "_blank");
  };

  return (
    <div className="product-list">
      {products &&
        products.map((product) => (
          <div
            key={product.tokenId}
            className="card-wrapper"
            onClick={() => openProductInfo(product.tokenId)}
          >
            <button
              className="favorite-button"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Heart clicked!");
              }}
            >
              <Heart className="heart-icon" />
            </button>

            <div className="card-content">
              <div className="image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="card-info">
                <h1 className="product-name">{product.name}</h1>
                <p className="product-desc">{product.desc}</p>
                <p className="product-seller">Token: {product.seller}</p>
                <div className="price-section">
                  <span className="product-price">
                    Price: {ethers.formatEther(product.price)} ETH
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductCardList;
