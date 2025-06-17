import { Feature } from "@/services/features";
import { Clock, Percent } from "lucide-react";
import React from "react";

interface FeaturesProps {
  features: Feature[];
}

const Features: React.FC<FeaturesProps> = ({ features }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "shipping":
        return (
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        );
      case "discount":
        return <Percent className="w-6 h-6 text-primary" />;
      case "delivery":
        return <Clock className="w-6 h-6 text-primary" />;
      case "secure":
        return (
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="max-w-screen-4xl mx-auto py-6">
      <div className="grid grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-gray-50 p-4 "
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {renderIcon(feature.icon)}
            </div>
            <div>
              <h4 className="font-semibold">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
