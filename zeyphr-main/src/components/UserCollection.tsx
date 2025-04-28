import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/utils/contract";
import { listItem } from "../utils/list";
import { unlistItem } from "../utils/unlist";
import "@/styles/sell.css"; // Import the sell.css file

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
}

export default function UserCollection({
  userAddress,
}: {
  userAddress: string;
  view: "sell" | "list";
}) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const total = await contract.getItemsByOwner(userAddress);
      const ownedItems: Item[] = [];

      for (let i = 1; i <= total; i++) {
        try {
          const owner = await contract.ownerOf(i);
          const itemData = await contract.getItems(i).catch(() => null);
          const tokenURI = await contract.tokenURI(i);

          const isOwnedByUser =
            owner.toLowerCase() === userAddress.toLowerCase();
          const isListedByUser =
            itemData?.listed &&
            itemData?.seller?.toLowerCase() === userAddress.toLowerCase();

          if (isOwnedByUser || isListedByUser) {
            let image = "";
            try {
              const res = await fetch(tokenURI);
              const metadata = await res.json();
              image = metadata.image;
            } catch (err) {
              console.error(`Failed to fetch metadata for token ${i}:`, err);
            }

            ownedItems.push({
              tokenId: i,
              price: itemData?.price?.toString() || "0",
              seller: itemData?.seller || "",
              buyer: itemData?.buyer || "",
              sold: itemData?.sold || false,
              listed: itemData?.listed || false,
              tokenURI,
              image,
            });
          }
        } catch (err) {
          console.log(`Error fetching token ${i}:`, err);
        }
      }

      setItems(ownedItems);
    };

    fetchNFTs();
  }, [userAddress]);

  return (
    <div className="user-collection-container">
      {items.map((item) => (
        <div key={item.tokenId} className="nft-card">
          <div className="nft-image-container">
            {item.image && (
              <img
                src={item.image}
                alt={`NFT ${item.tokenId}`}
                className="nft-image"
              />
            )}
          </div>
          <div className="nft-info">
            <div className="nft-token-id">{`Token ID: ${item.tokenId}`}</div>
            <div className="nft-status">
              {item.listed ? "Listed" : "Unlisted"}
            </div>
            <div className="nft-price">
              {ethers.formatEther(item.price)} ETH
            </div>
          </div>

          <div className="nft-action-buttons">
            {item.listed ? (
              <button
                className="unlist-button"
                onClick={() => unlistItem(item.tokenId)}
              >
                Unlist
              </button>
            ) : (
              <button
                className="list-button"
                onClick={() => listItem(item.tokenId)}
              >
                List
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
