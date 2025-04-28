import { useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { useRouter } from "next/router";
import { mintNFT } from "../utils/mint";
import { toast, ToastContainer } from "react-toastify";
import UserCollection from "@/components/UserCollection";
import "@/styles/sell.css"; // Import the CSS file

const Sell = () => {
  const { addProduct } = useProduct();
  const router = useRouter();
  const [images, setImages] = useState<any>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [view, setView] = useState("sell"); // State to toggle between 'sell' and 'list/unlist'

  const handleFileUpload = (e: any) => {
    setImages(e.target.files[0]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { receipt, imageURL } = await mintNFT(
      formData.title,
      formData.description,
      formData.price,
      images
    );
    let { staus, hash } = receipt;
    if (staus === 0) {
      toast.error("Transaction Failed");
    }
    toast.success(`NFT tx Successful created \n Hash: ${hash}`);
    const newProduct = {
      id: Date.now().toString(),
      name: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      images: imageURL,
    };

    addProduct(newProduct);
    router.push("/");
  };

  return (
    <div className="sell-container">
      <h2>Add New Product</h2>

      {/* Toggle buttons */}
      <div className="toggle-buttons">
        <a
          href="#"
          className={`button-toggle ${view === "sell" ? "active" : ""}`}
          onClick={() => setView("sell")}
        >
          Sell
        </a>
        <a
          href="#"
          className={`button-toggle ${view === "list" ? "active" : ""}`}
          onClick={() => setView("list")}
        >
          Unlist/List
        </a>
      </div>

      {/* Conditional rendering based on selected view */}
      {view === "sell" ? (
        <form onSubmit={handleSubmit}>
          <label className="label">Product Title</label>
          <input
            className="input-field"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label className="label">Description</label>
          <textarea
            className="textarea-field"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label className="label">Price</label>
          <input
            className="input-field"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label className="label">Upload Product Images</label>
          <input
            type="file"
            className="input-field"
            name="images"
            onChange={handleFileUpload}
            required
          />

          <button type="submit" className="button">
            Add Product
          </button>
        </form>
      ) : (
        <UserCollection
          userAddress={process.env.NEXT_PUBLIC_KEY || "NEXT_PUBLIC_KEY"}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Sell;
