import React from "react";

const PricingCard = ({ title, price, features, buttonText, highlight, badge, subtext }) => (
  <div
  className={`flex flex-col border p-6 rounded-2xl shadow-md w-full max-w-sm transition duration-300 transform ${
    highlight
      ? "hover:border-indigo-500 hover:scale-105 bg-indigo-950"
      : "bg-slate-800 hover:border-indigo-500 hover:scale-105"
  }`}
>

    {badge && (
      <span className="text-xs font-semibold text-white bg-indigo-600 px-2 py-1 rounded self-center mb-3">
        {badge}
      </span>
    )}
    <h2 className="text-xl font-semibold text-white text-center">{title}</h2>
    <p className="text-3xl font-bold text-white text-center mt-2">
      {price}
      <span className="text-base font-normal"> /month</span>
    </p>
    {subtext && <p className="text-sm text-center text-green-600 mt-1">{subtext}</p>}
    <button className="mt-4 mb-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
      {buttonText}
    </button>
    <ul className="text-sm space-y-2 text-gray-200">
      {features.map((f, idx) => (
        <li key={idx} className="flex items-start">
          <span className="text-green-500 mr-2">✔</span>
          <span>{f}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Pricing = () => {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-white">Obi-Watch-Kenobi Plans</h1>
      <div className="flex flex-wrap gap-8 justify-center lg:flex-nowrap ">
        <PricingCard
          title="Obi Free"
          price="€0.00"
          buttonText="Get Obi Free"
          features={[
            "Monitor 1 device",
            "Basic EDR & log tracking",
            "Community support",
            "No card required",
          ]}
        />
        <PricingCard
          title="Obi Plus"
          price="€4.49"
          buttonText="Get Obi Plus"
          badge="BEST DEAL"
          subtext="Save €132 – 30-day refund"
          highlight
          features={[
            "Secure up to 10 devices",
            "Advanced threat detection",
            "Real-time alerts & AI suggestions",
            "Block malicious IPs",
            "Email incident notifications",
            "Priority support",
          ]}
        />
        <PricingCard
          title="Obi Unlimited"
          price="€7.99"
          buttonText="Get Obi Unlimited"
          subtext="Save €120 – 30-day refund"
          features={[
            "All Obi Plus features",
            "Unlimited devices",
            "Automated playbooks & quarantine",
            "Chatbot-assisted threat analysis",
            "Secure file recovery",
            "Access to full Obi Suite (EDR, VPN, Mail)",
          ]}
        />
      </div>
    </div>
  );
};

export default Pricing;
