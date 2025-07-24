import React, { useState } from "react";

const OrderModal = ({ item, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // const handleSubmit = () => {
  //   if (formData.name && formData.email && formData.phone && formData.address) {
  //     onConfirm(formData);
  //   } else {
  //     alert("Please fill all fields");
  //   }
  // };
  const handleSubmit = async () => {
  if (formData.name && formData.email && formData.phone && formData.address) {
    const payload = {
      orderId: item.id || `PKG-${Date.now()}`, // or get this from your item
      from: "Mumbai",
      to: formData.address,
      distance: 50, // static or calculated if needed
      email: formData.email,
    };

    try {
      const res = await fetch("https://e0qixjf9uh.execute-api.us-east-1.amazonaws.com/add-delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Order placed successfully", data);

      onConfirm(formData); // or close modal
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  } else {
    alert("Please fill all fields");
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Order Details for {item.name}</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <textarea name="address" placeholder="Address" onChange={handleChange} className="w-full mb-2 p-2 border rounded"></textarea>
        <p className="text-red-600 font-bold mb-4">* Only Cash on Delivery Available</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Confirm Order</button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
