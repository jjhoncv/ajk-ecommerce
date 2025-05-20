import React from "react";

const Newsletter: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-700 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mantente en casa y consigue tu entrega diaria desde nuestra tienda
            </h2>
            <p className="text-gray-200 mb-8">
              Comienza tus compras diarias con TechStore
            </p>
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="email"
                  placeholder="Tu dirección de email"
                  className="w-full px-4 py-3 rounded-lg"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#22C55E] text-white px-6 py-2 rounded-lg hover:bg-[#16A34A] transition-colors">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
              alt="Delivery"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
