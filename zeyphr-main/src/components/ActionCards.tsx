import { ScanLine, Wallet, CreditCard, Users, BanknoteIcon, History } from "lucide-react";
import '../styles/actionCard.css';

const ActionCardGrid = ({ balance }: { balance: string }) => {
  const topActions = [
    {
      icon: (
        <ScanLine className="card-icon" style={{ color: "#818cf8" }} />
      ),
      title: "Scan & Pay",
      redirect: "/scan",
      subtitle: "Quick and secure payments",
    },
    {
      icon: (
        <Wallet className="card-icon" style={{ color: "#14b8a6" }} />
      ),
      title: "Wallet Balance",
      subtitle: balance,
    },
  ];

  const bottomActions = [
    {
      icon: (
        <CreditCard className="card-icon" style={{ color: "#a78bfa" }} />
      ),
      title: "Pay",
      redirect: "/pay",
      subtitle: "Make a payment",
    },
    {
      icon: (
        <Users className="card-icon" style={{ color: "#f472b6" }} />
      ),
      title: "Contact",
      redirect: "/pay",
      subtitle: "Pay to contacts",
    },
    {
      icon: (
        <BanknoteIcon className="card-icon" style={{ color: "#fb923c" }} />
      ),
      title: "Transfer",
      redirect: "/pay",
      subtitle: "Bank transfers",
    },
    {
      icon: (
        <History className="card-icon" style={{ color: "#60a5fa" }} />
      ),
      title: "History",
      redirect: "/history",
      subtitle: "Transaction history",
    },
  ];

  return (
    <section className="action-card-section">
      {/* Top row with 2 cards */}
      <div className="action-card-grid-top">
        {topActions.map(({ icon, title, redirect, subtitle }) => (
          <div
            key={title}
            className="card"
            onClick={() => {
              window.open(redirect);
            }}
          >
            {icon}
            <div className="card-title">{title}</div>
            <div className="card-subtitle">{subtitle}</div>
          </div>
        ))}
      </div>

      {/* Bottom row with 4 cards */}
      <div className="action-card-grid-bottom">
        {bottomActions.map(({ icon, title, redirect, subtitle }) => (
          <div
            key={title}
            className="card"
            onClick={() => {
              window.open(redirect);
            }}
          >
            {icon}
            <div className="card-title">{title}</div>
            <div className="card-subtitle">{subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActionCardGrid;
