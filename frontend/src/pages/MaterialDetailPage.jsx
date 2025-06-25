import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const formatSummary = (text) => {
  if (!text) return "";

  // Replace '^' with <sup> where appropriate
  const formatted = text
    .split("\n")
    .filter(line => line.trim() !== "")
    .map((line, idx) => (
      <p key={idx} className="mb-2">
        {
          line.split(/(\^.\b)/).map((part, i) => {
            if (part.startsWith('^') && part.length > 1) {
              return <sup key={i}>{part[1]}</sup>;
            }
            return <span key={i}>{part}</span>;
          })
        }
      </p>
    ));

  return formatted;
};

const MaterialDetailPage = () => {
  const { id, materialId } = useParams();
  const [material, setMaterial] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/classrooms/materials/${materialId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`
      }
    })
    .then(res => setMaterial(res.data))
    .catch(err => console.error(err));
  }, [materialId]);

  if (!material) return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">Material Detail</h1>

        <a
          href={material.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
        >
          Download PDF
        </a>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">Summary</h2>
          {material.summary ? (
            <div className="text-gray-800 leading-relaxed">
              {formatSummary(material.summary)}
            </div>
          ) : (
            <p className="text-gray-500 italic">Processing... Summary not available yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">Flashcards</h2>
          {material.flashcards ? (
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              {JSON.parse(material.flashcards).map((card, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  <p><strong>Q:</strong> {card.question}</p>
                  <p><strong>A:</strong> {card.answer}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Processing... Flashcards not available yet.</p>
          )}
        </div>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow">
          Take Quiz
        </button>
      </div>
    </div>
  );
};

export default MaterialDetailPage;
