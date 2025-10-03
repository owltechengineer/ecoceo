"use client";

import { useState } from "react";
// import { useTheme } from "next-themes";

const NewsLatterBox = ({ newsletterData }) => {
  const [email, setEmail] = useState("");
  // const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <div className="wow fadeInUp w-full" data-wow-delay=".2s">
      <div className="w-full px-4">
        <div className="mx-auto max-w-[570px] text-center">
          <h3 className="mb-2 text-3xl font-bold text-black dark:text-white sm:text-2xl md:text-[40px] md:leading-[1.2]">
            {newsletterData?.title || "Subscribe To Get Notified"}
          </h3>
          <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
            {newsletterData?.description || "Subscribe to our newsletter for the latest updates and insights."}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 md:flex-row md:gap-2">
              <input
                type="email"
                name="email"
                placeholder={newsletterData?.placeholder || "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-transparent py-4 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp md:w-auto md:px-7 lg:px-6 xl:px-9"
              >
                {newsletterData?.buttonText || "Subscribe"}
              </button>
            </div>
          </form>
          <p className="mt-4 text-xs text-body-color dark:text-body-color-dark">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLatterBox;
