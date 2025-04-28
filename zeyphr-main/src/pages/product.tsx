"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getContract } from "@/utils/contract";
import { ethers } from "ethers";


const contract = getContract();

export default  function ProductPage() {
  const { addItem } = useCart();
  const router = useRouter();
  const { productId }: any = router.query;
  const [product, setProduct] = useState<any>(null);

  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleAddToCart = () => {
    addItem({
      id: productId,
      title: product.name, // Use correct name field
      subtitle: product.desc,
      image: product.image,
      price: product.price,
    });
    toast.success("Product added to cart successfully!");
  };

  const handleBuyNow = () => {
    addItem({
      id: productId,
      title: product.name,
      subtitle: product.desc,
      image: product.image,
      price: product.price,
    });
    router.push("/cart");
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };
  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return; // wait until productId is available
      const itemData = await contract.getItems(productId).catch(() => null);
      const tokenURI = await contract.tokenURI(productId);
      const res = await fetch(tokenURI);
      const product = await res.json();
      product.price = ethers.formatEther(itemData.price.toString());
      setProduct(product);
    };

    fetchProduct();
  }, [productId]); // run when productId is ready

  if (!product) return <div>Loading...</div>; // or some spinner
  
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#fff", padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          {/* Product Images */}
          <div>
            <div
              style={{
                aspectRatio: "1/1",
                background: "#f3f4f6",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    aspectRatio: "1/1",
                    background: "#f3f4f6",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} view ${index + 1}`}
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>
              {product.name}
            </h1>
            <p style={{ color: "#4b5563", marginTop: "0.5rem" }}>
              {product.desc}
            </p>

            <p>
              Price :  {product.price} ETH
            </p>

  

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  background: "#000",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Heart size={20} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  background: "#000",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <ShoppingBag size={20} /> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Comments and Ratings */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Ratings & Reviews
          </h2>

          {/* Rating Stars */}
          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
              Rate this Product
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={30}
                  color={star <= rating ? "#fbbf24" : "#d1d5db"}
                  onClick={() => handleRatingClick(star)}
                  style={{ cursor: "pointer" }}
                  fill={star <= rating ? "#fbbf24" : "none"}
                />
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div style={{ marginTop: "1.5rem" }}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              style={{
                width: "100%",
                height: "6rem",
                padding: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                resize: "none",
              }}
            />
            <button
              style={{
                marginTop: "1rem",
                background: "#000",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
              }}
              onClick={() => {
                if (comment.trim() !== "") {
                  toast.success("Thanks for your feedback!");
                  setComment("");
                }
              }}
            >
              Submit Review
            </button>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
