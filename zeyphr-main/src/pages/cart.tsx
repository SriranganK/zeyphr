import { useState } from "react";
import Navbar from "@/components/navbar";
import { useCart } from "../context/CartContext";
import { Trash2 } from "lucide-react"; // using lucide-react
import "../styles/cart.css"; // Import the CSS file
import { useRouter } from "next/router";

export default function Cart() {
  const router = useRouter()
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();

const calculateTotal = () => {
  return cartItems
    .reduce((total, item) => total + parseFloat(item.price), 0)
    .toFixed(2);
};
  return (
    <>
      <div className="cart-container">
        <h1 className="cart-heading">Your Cart</h1>

        {cartItems.length > 0 && (
          <div className="clear-cart">
            <button className="clear-cart-button" onClick={clearCart}>
              <Trash2 style={{ marginRight: "0.5rem" }} />
              Clear Cart
            </button>
          </div>
        )}

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="col-sm-12 empty-cart-cls text-center">
                <img
                  src="https://i.imgur.com/dCdflKN.png"
                  width="130"
                  height="130"
                  className="img-fluid mb-4 mr-3"
                  alt="Empty Cart"
                />
                <h3>
                  <strong>Your Cart is Empty</strong>
                </h3>
                <h4 className="empty-cart-message">
                  Looks like you haven't added anything to your cart yet
                </h4>
                <button
                  className="remove-button"
                  onClick={() => router.push("/")}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-subtitle">{item.subtitle}</p>
                    <div className="item-price">₹{item.price}</div>
                    <div className="item-actions">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Price Summary */}
          {cartItems.length > 0 && (
            <div className="price-summary">
              <h2 className="summary-heading">Price Details</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Price</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Charges</span>
                  <span className="free-delivery">Free</span>
                </div>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{calculateTotal()}</span>
              </div>

              <button
                className="place-order-button"
                onClick={() => window.open("/checkout")}
              >
                PLACE ORDER
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
