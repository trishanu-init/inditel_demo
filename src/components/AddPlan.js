import React, { useState } from 'react';
import axios from 'axios';

const AddPlan = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [planType, setPlanType] = useState(''); // New state for Prepaid/Postpaid
  const [servicesIncluded, setServicesIncluded] = useState({
    fiberLandline: { speed: '', calls: '' },
    dth: { value: '' },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    try {
      console.log(planType);
      await axios.post(
        'http://localhost:5004/services/plans',
        { name, description, price,  servicesIncluded:servicesIncluded ,planType:planType}// Include planType in the request body
        //{ headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Plan added successfully!');
    } catch (error) {
      alert('Failed to add plan');
    }
  };

  return (
    <div>
      <h1>Add New Plan</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Plan Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        {/* Dropdown for selecting Prepaid/Postpaid */}
        <div>
          <label>Plan Type:</label>
          <select value={planType} onChange={(e) => setPlanType(e.target.value)} required>
            <option value="">Select Type</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Postpaid">Postpaid</option>
          </select>
        </div>

        <h2>Services Included</h2>
        <div>
          <h3>Fiber + Landline</h3>
          <label>Speed:</label>
          <input
            type="text"
            value={servicesIncluded.fiberLandline.speed}
            onChange={(e) => setServicesIncluded({ ...servicesIncluded, fiberLandline: { ...servicesIncluded.fiberLandline, speed: e.target.value } })}
          />
          <label>Unlimited Calls:</label>
          <input
            type="text"
            value={servicesIncluded.fiberLandline.calls}
            onChange={(e) => setServicesIncluded({ ...servicesIncluded, fiberLandline: { ...servicesIncluded.fiberLandline, calls: e.target.value } })}
          />
        </div>
        <div>
          <h3>DTH</h3>
          <label>Value:</label>
          <input
            type="text"
            value={servicesIncluded.dth.value}
            onChange={(e) => setServicesIncluded({ ...servicesIncluded, dth: { value: e.target.value } })}
          />
        </div>

        <button type="submit">Add Plan</button>
      </form>
    </div>
  );
};

export default AddPlan;
