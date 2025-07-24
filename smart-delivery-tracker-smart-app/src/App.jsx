// App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import ItemList from "./components/ItemList";
import OrderModal from "./components/OrderModal";
import Orders from "./components/Orders";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePlaceOrder = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // const handleConfirmOrder = (formData) => {
  //   const orderId = `ORD-${Date.now()}`;
  //   const newOrder = {
  //     ...formData,
  //     ...selectedItem,
  //     orderId,
  //     deliveryStatus: "Pending",
  //   };
  //   setOrders((prev) => [...prev, newOrder]);
  //   setShowModal(false);
  //   setShowConfirmation(true);
  //   setTimeout(() => setShowConfirmation(false), 2500);
  // };

   const handleConfirmOrder = async (formData) => {
  const payload = {
    from: "Mumbai",
    to: formData.address,
    distance: 0, // static for now
    email: formData.email,
  };

  try {
    const res = await fetch("https://e0qixjf9uh.execute-api.us-east-1.amazonaws.com/add-delivery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    const newOrder = {
      ...formData,
      ...selectedItem,
      orderId: data.orderId, // ✅ Use backend orderId
      deliveryStatus: "Pending",
    };

    setOrders((prev) => [...prev, newOrder]);
    setShowModal(false);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2500);
  } catch (err) {
    console.error("Failed to place order", err);
  }
};


  return (
    <div className="font-sans">
      {showConfirmation ? (
        <div className="fixed inset-0 bg-green-600 text-white flex items-center justify-center z-50">
          <div className="text-center text-3xl font-bold">✅ Order Confirmed!</div>
        </div>
      ) : (
        <>
          <Header onShowOrders={() => setShowOrders(true)} />
          {!showOrders && <ItemList onPlaceOrder={handlePlaceOrder} />}
          {showOrders && <Orders orders={orders} onBack={() => setShowOrders(false)} />}
          {showModal && (
            <OrderModal
              item={selectedItem}
              onClose={() => setShowModal(false)}
              onConfirm={handleConfirmOrder}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
