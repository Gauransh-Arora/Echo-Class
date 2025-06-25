import React from "react";

const ClassCard = ({ code }) => {
  return (
    <div className="bg-yellow-300 rounded-lg flex items-center justify-center text-white font-bold text-2xl h-32 shadow hover:shadow-lg transition">
      {code || "Unnamed"}
    </div>
  );
};

export default ClassCard;
