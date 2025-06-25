import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ParticularClassPage = () => {
  const { id } = useParams();  // classroom ID
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/classrooms/materials/?classroom=${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`
      }
    })
    .then(res => setMaterials(res.data))
    .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class Materials</h1>
      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material.id} className="p-4 bg-blue-100 rounded shadow">
            <p className="font-semibold">Material ID: {material.id}</p>
            <p className="text-blue-600 truncate">{material.file}</p>
            <Link
              to={`/class/${id}/material/${material.id}`}
              className="inline-block mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              View Material
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticularClassPage;
