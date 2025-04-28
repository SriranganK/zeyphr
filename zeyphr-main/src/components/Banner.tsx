import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

const Banner = () => {
  const images = [
    { src: "iota.jpeg", alt: "Banner 1" },
    { src: "eth.jpg", alt: "Banner 2" },
    { src: "banner3.jpg", alt: "Banner 3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "24px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "98%",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          minHeight: "384px",
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={goPrev}
          style={{
            position: "absolute",
            top: "50%",
            left: "16px",
            transform: "translateY(-50%)",
            zIndex: "10",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          <ArrowLeft style={{ color: "#6B7280" }} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goNext}
          style={{
            position: "absolute",
            top: "50%",
            right: "16px",
            transform: "translateY(-50%)",
            zIndex: "10",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          <ArrowRight style={{ color: "#6B7280" }} />
        </button>

        {/* Banner Image */}
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          style={{
            width: "100%",
            height: "384px",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        />

        {/* Pagination Dots */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "16px",
            display: "flex",
            gap: "8px",
            zIndex: "20",
          }}
        >
          {images.map((_, index) => (
            <span
              key={index}
              style={{
                width: index === currentIndex ? "24px" : "8px",
                height: "4px",
                backgroundColor:
                  index === currentIndex ? "#fff" : "rgba(255, 255, 255, 0.5)",
                borderRadius: "9999px",
                transition: "width 0.3s",
              }}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Banner;