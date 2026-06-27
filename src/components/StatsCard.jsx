import React from "react";

export default function StatsCard({ title, value, color }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className={`text-3xl font-bold text-${color}-600`}>
        {value || 0}
      </h2>

    </div>
  );

}