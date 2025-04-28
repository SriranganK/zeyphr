"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/utils/contract";

import { buyItem } from "../utils/buy";

const contract = getContract();

interface Item {
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

export default function Marketplace() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchListedItems = async () => {
      const total = await contract.getTotalNfts();
      const listedItems: Item[] = [];

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

      setItems(listedItems);
    };

    fetchListedItems();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mt-24">
      {items.map((item) => (
        <div key={item.tokenId} className="border p-4 rounded shadow">
          {item.image && (
            <img
              src={item.image}
              alt={`NFT ${item.tokenId}`}
              className="w-full h-60 object-cover mb-2"
            />
          )}
          <div>Token ID: {item.tokenId}</div>
          <div>Price: {ethers.formatEther(item.price)} ETH</div>
          <div className="mt-4">{item.name}</div>
          <div className="mt-4">{item.desc}</div>
          <div className="my-4">{item.seller}</div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={() => buyItem(item.tokenId)}
          >
            Buy
          </button>
        </div>
      ))}
    </div>
  );
}
