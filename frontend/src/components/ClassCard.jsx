import React from 'react';
import { Link } from 'react-router-dom';

const ClassCard = ({ title, code, id }) => {
  return (
    <Link to={`/class/${id}/stream`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="h-24 bg-blue-600 rounded-t-lg"></div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">Code: {code}</p>
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;
