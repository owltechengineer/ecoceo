"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import SubscriptionPlans from "@/components/Shop/SubscriptionPlans";

const PricingPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="bg-gradient-to-b from-gray-800 via-gray-400 to-white text-black">
        <Breadcrumb
          pageName="Piani e Prezzi"
          description="Scegli il piano perfetto per le tue esigenze"
        />
      </div>

      {/* Pricing Content */}
      <SubscriptionPlans />
    </>
  );
};

export default PricingPage;
