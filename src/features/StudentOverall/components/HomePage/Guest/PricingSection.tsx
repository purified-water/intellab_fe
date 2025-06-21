import { Button } from "@/components/ui";
import { HOME_PAGE, pricingPlans } from "@/features/StudentOverall/constants/homePageStrings";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function PricingSection() {
  const navigate = useNavigate();

  const handlePlanClick = (planName: string) => {
    if (planName === "Free") {
      navigate("/login");
    } else {
      navigate("/pricing");
    }
    window.scrollTo(0, 0);
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mb-12 space-y-4 text-center">
          <div className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-appPrimary/10 text-appPrimary">
            Pricing
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl bg-gradient-to-r from-appPrimary to-appAccent bg-clip-text">
            {HOME_PAGE.PRICING.TITLE}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">{HOME_PAGE.PRICING.DESCRIPTION}</p>
        </div>

        <div className="grid items-stretch max-w-4xl grid-cols-1 gap-6 mx-auto md:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className={`relative self-center flex flex-col border justify-between p-6 rounded-lg shadow-md shadow-muted-foreground/10 transition-all ${
                plan.featured ? "bg-appPrimary/10 border-appPrimary h-[350px]" : "bg-zinc-50 border-gray6 h-[300px]"
              }`}
            >
              {plan.featured && (
                <div className="absolute px-3 py-1 text-xs font-semibold text-white rounded-full top-4 right-4 bg-appPrimary">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className={`text-2xl font-bold ${plan.name === "Premium" ? "text-appPrimary" : "text-gray2"}`}>
                  {plan.name}
                </h3>
                {plan.name !== "Free" && <span className="text-sm text-gray3">From </span>}

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.name !== "Free" && <span className="ml-1 text-sm text-gray-500">/month</span>}
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-appPrimary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className=""
                onClick={() => handlePlanClick(plan.name)}
                variant={plan.featured ? "default" : "outline"}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
