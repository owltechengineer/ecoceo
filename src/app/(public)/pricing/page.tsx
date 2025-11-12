"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import SubscriptionPlans from "@/components/Shop/SubscriptionPlans";

const PricingPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div>
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
