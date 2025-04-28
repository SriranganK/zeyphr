"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";
import { useRouter } from "next/router"; // For navigation
import { useCart } from "../context/CartContext";
import { bulkBuyItems } from "@/utils/buy";

interface PaymentStep {
  id: number;
  title: string;
  completed: boolean;
}

const Checkout = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const { cartItems } = useCart();
  const router = useRouter(); // Initialize the router to navigate programmatically

  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<PaymentStep[]>([
    { id: 1, title: "DELIVERY ADDRESS", completed: false },
    { id: 2, title: "ORDER SUMMARY", completed: false },
    { id: 3, title: "PAYMENT OPTIONS", completed: false },
  ]);
  const [privateKey, setPrivateKey] = useState("");
  const [showToast, setShowToast] = useState({ message: "", type: "" });

  const handleContinue = () => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === currentStep ? { ...step, completed: true } : step
      )
    );
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1)); // Prevent going below 1
  };

  const handleCancelOrder = () => {
    router.push("/cart"); // Redirect to the cart page
  };

  const handlePayment = async() => {
    const tokenIds = cartItems.map((item) => item.id);
    console.log(tokenIds);
    const response = await bulkBuyItems(tokenIds);
    if(response.status === 0){
      setShowToast({
        message: "Something went wrong",
        type: "error", 
      })
    }
    setShowToast({
      message: "Your order has been placed successfully",
      type: "success",
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1871e1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "16px",
  };

  const getTotalAmount = () => {
 return cartItems
   .reduce((total, item) => total + parseFloat(item.price), 0)
   .toFixed(2);
  };


const DeliveryAddressStep = () => (
  <div
    style={{
      background: "white",
      padding: "24px",
      borderRadius: "10px",
      boxShadow: "0 0 5px #ccc",
    }}
  >
    <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "#374151" }}>
      DELIVERY ADDRESS
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input
        style={inputStyle}
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Mobile Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        style={inputStyle}
        placeholder="Address (Area and Street)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        style={buttonStyle}
        onClick={handleContinue}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1871e1")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6238f1")}
      >
        CONTINUE
      </button>
      <button
        style={{
          ...buttonStyle,
          backgroundColor: "#ef4444",
          marginTop: "8px",
        }}
        onClick={handleCancelOrder}
      >
        CANCEL ORDER
      </button>
    </div>
  </div>
);


const OrderSummaryStep = () => (
  <div
    style={{
      background: "white",
      padding: "24px",
      borderRadius: "10px",
      boxShadow: "0 0 5px #ccc",
    }}
  >
    <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "#374151" }}>
      ORDER SUMMARY
    </h3>

    {cartItems.length === 0 ? (
      <p>Your cart is empty</p>
    ) : (
      <>
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "16px",
              borderBottom: "1px solid #eee",
              paddingBottom: "16px",
              marginBottom: "16px",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: "128px", height: "128px", objectFit: "cover" }}
            />
            <div>
              <h4 style={{ fontWeight: "500" }}>{item.title}</h4>
              <p style={{ color: "#6b7280" }}>{item.description}</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  ₹{item.price}
                </span>
                {item.originalPrice && (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#9ca3af",
                      }}
                    >
                      ₹{item.originalPrice}
                    </span>
                    <span style={{ color: "green" }}>
                      {Math.round(
                        ((item.originalPrice - item.price) /
                          item.originalPrice) *
                          100
                      )}
                      % Off
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Price ({cartItems.length} items)</span>
            <span>₹{getTotalAmount()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <span>Delivery Charges</span>
            <span style={{ color: "green" }}>FREE</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          <span>Total Amount</span>
          <span>₹{getTotalAmount()}</span>
        </div>

        <div
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "16px",
            marginBottom: "16px",
          }}
        >
          <h4 style={{ fontWeight: "500" }}>Delivery Address</h4>
          <div>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Phone:</strong> {phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Address:</strong> {address}
            </p>
          </div>
        </div>

        <button
          style={buttonStyle}
          onClick={handleContinue}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1871e1")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#6238f1")
          }
        >
          CONTINUE
        </button>
      </>
    )}
  </div>
);


  const PaymentStepComponent = () => (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0 0 5px #ccc",
      }}
    >
      <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "#374151" }}>
        PAYMENT OPTIONS
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            backgroundColor: "#eff6ff",
            padding: "16px",
            borderRadius: "8px",
            display: "flex",
            gap: "8px",
          }}
        >
          <span>💳</span>
          <span style={{ fontWeight: "500" }}>Web3 Wallet Payment</span>
        </div>
        <div
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        >

          <button style={buttonStyle} onClick={handlePayment} onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1EAEDB")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#6238f1")
          }>
            PAY ₹{getTotalAmount()}
          </button>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#ef4444",
              marginTop: "8px",
            }}
            onClick={handleCancelOrder}
          >
            CANCEL ORDER
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        style={{
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div
            style={{
              marginBottom: "24px",
              overflowX: "auto",
              display: "flex",
              gap: "12px",
            }}
          >
            {steps.map((step, index) => (
              <div
                key={step.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    backgroundColor:
                      step.completed || step.id === currentStep
                        ? "#2563eb"
                        : "#9ca3af",
                    color: "#fff",
                    width: "32px",
                    height: "32px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}

                >
                  {step.id}
                </div>
                <span
                  style={{
                    cursor: "pointer",
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                    color:
                      step.completed || step.id === currentStep
                        ? "#2563eb"
                        : "#6b7280",
                    fontWeight:
                      step.completed || step.id === currentStep
                        ? "500"
                        : "normal",
                  }}
                  onClick={() => setCurrentStep(step.id)}
                >
                  {step.title}
                </span>
                {index !== steps.length - 1 && (
                  <div
                    style={{
                      width: "32px",
                      height: "1px",
                      backgroundColor: "#e5e7eb",
                      marginLeft: "8px",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {showToast.message && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "6px",
                backgroundColor:
                  showToast.type === "error" ? "#fee2e2" : "#dcfce7",
                color: showToast.type === "error" ? "#b91c1c" : "#15803d",
              }}
            >
              {showToast.message}
            </div>
          )}

          {currentStep === 1 && <DeliveryAddressStep />}
          {currentStep === 2 && <OrderSummaryStep />}
          {currentStep === 3 && <PaymentStepComponent />}
        </div>
      </div>
    </>
  );
};

export default Checkout;
