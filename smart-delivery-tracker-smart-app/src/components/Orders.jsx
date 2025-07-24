// // components/Orders.jsx
// import React, { useState } from "react";

// const Orders = ({ orders, onBack }) => {
//   const [statusCardId, setStatusCardId] = useState(null);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-green-100";
//       case "Shipped":
//         return "bg-blue-100";
//       case "Out for Delivery":
//         return "bg-orange-100";
//       case "Delivered":
//         return "bg-green-200";
//       default:
//         return "bg-gray-100";
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
//       <button
//         onClick={onBack}
//         className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Back
//       </button>
//       {orders.length === 0 ? (
//         <p>No orders placed yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div key={order.orderId} className="border p-4 rounded-xl shadow bg-white">
//               <div className="flex gap-4">
//                 <img
//                   src={order.image}
//                   alt={order.name}
//                   className="w-24 h-24 object-contain"
//                 />
//                 <div className="flex-1">
//                   <h3 className="text-xl font-semibold">{order.name}</h3>
//                   <p>{order.description}</p>
//                   <p className="font-bold">{order.cost}</p>
//                   <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
//                   <button
//                     className="mt-2 bg-gray-800 text-white px-3 py-1 rounded"
//                     onClick={() =>
//                       setStatusCardId(statusCardId === order.orderId ? null : order.orderId)
//                     }
//                   >
//                     {statusCardId === order.orderId ? "Hide Status" : "Check Delivery Status"}
//                   </button>
//                 </div>
//               </div>
//               {statusCardId === order.orderId && (
//                 <div className={`mt-4 p-4 rounded ${getStatusColor(order.deliveryStatus)}`}>
//                   <p className="font-bold mb-2">Delivery Status: {order.deliveryStatus}</p>
//                   <div className="h-2 bg-gray-300 rounded-full mb-2">
//                     <div className="h-2 bg-green-500 rounded-full w-1/3"></div>
//                   </div>
//                   <ul className="text-sm text-gray-700 space-y-1">
//                     <li><strong>Order ID:</strong> {order.orderId}</li>
//                     <li><strong>Started On:</strong> [To be filled]</li>
//                     <li><strong>Distance Covered:</strong> [To be filled]</li>
//                     <li><strong>Estimated Arrival:</strong> [To be filled]</li>
//                     <li><strong>Time Remaining:</strong> [To be filled]</li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;


import React, { useState } from "react";

const Orders = ({ orders, onBack }) => {
  const [statusCardId, setStatusCardId] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100";
      case "Shipped": return "bg-blue-100";
      case "Out for Delivery": return "bg-orange-100";
      case "Delivered": return "bg-green-200";
      default: return "bg-gray-100";
    }
  };

//   const handleStatusClick = async (order) => {
//     if (statusCardId === order.orderId) {
//       setStatusCardId(null);
//       return;
//     }

//     setLoading(true);
//     setStatusCardId(order.orderId);

//     try {                     
//       const res = await fetch("https://e0qixjf9uh.execute-api.us-east-1.amazonaws.com/update-delivery", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId: order.orderId }),
//       });

//       const data = await res.json();
//       const { status, createdAt, distance, avgSpeed } = data;

//       const now = new Date();
//       // const start = new Date(createdAt);
//       // const elapsed = (now - start) / (1000 * 60 * 60);
//       // const covered = avgSpeed * elapsed;
//       // const etaHours = (distance - covered) / avgSpeed;

//       // setDeliveryInfo((prev) => ({
//       //   ...prev,
//       //   [order.orderId]: {
//       //     status,
//       //     createdAt,
//       //     distanceCovered: Math.min(distance, covered.toFixed(2)),
//       //     eta: etaHours > 0 ? `${etaHours.toFixed(1)} hrs` : "Delivered",
//       //     remaining: etaHours > 0 ? `${(etaHours * 60).toFixed(0)} min` : "0 min",
//       //     progressPercent: Math.min((covered / distance) * 100, 100).toFixed(0)
//       //   },
//       // }));

//       const distanceNum = Number(distance);
// const speedNum = Number(avgSpeed);

// const elapsed = (now - new Date(createdAt)) / (1000 * 60 * 60); // in hours
// const covered = speedNum * elapsed;

// const etaHours = distanceNum > 0 ? (distanceNum - covered) / speedNum : 0;
// const progress = distanceNum > 0 ? (covered / distanceNum) * 100 : 0;

// setDeliveryInfo((prev) => ({
//   ...prev,
//   [order.orderId]: {
//     status,
//     createdAt,
//     distanceCovered: Math.min(distanceNum, covered).toFixed(2),
//     eta: etaHours > 0 ? `${etaHours.toFixed(1)} hrs` : "Delivered",
//     remaining: etaHours > 0 ? `${(etaHours * 60).toFixed(0)} min` : "0 min",
//     progressPercent: Math.min(progress, 100).toFixed(0),
//   },
// }));

//     } catch (err) {
//       console.error("Error fetching delivery status", err);
//     }

//     setLoading(false);
//   };
  const handleStatusClick = async (order) => {
  if (statusCardId === order.orderId) {
    setStatusCardId(null);
    return;
  }

  setLoading(true);
  setStatusCardId(order.orderId);

  try {
    const res = await fetch("https://e0qixjf9uh.execute-api.us-east-1.amazonaws.com/update-delivery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.orderId }),
    });

    const data = await res.json(); 
    console.log(data);
    const { status, createdAt, distance, avgSpeed } = data;

    const now = new Date();
    const start = new Date(createdAt);
    const elapsed = (now - start) / (1000 * 60 * 60); // elapsed hours

    const distanceNum = Number(distance);
    const speedNum = Number(avgSpeed);
    const covered = speedNum * elapsed;
    const etaHours = distanceNum > 0 ? (distanceNum - covered) / speedNum : 0;
    const progress = distanceNum > 0 ? (covered / distanceNum) * 100 : 0;

    setDeliveryInfo((prev) => ({
      ...prev,
      [order.orderId]: {
        status,
        createdAt,
        distanceCovered: Math.min(distanceNum, covered).toFixed(2),
        eta: etaHours > 0 ? `${etaHours.toFixed(1)} hrs` : "Delivered",
        remaining: etaHours > 0 ? `${(etaHours * 60).toFixed(0)} min` : "0 min",
        progressPercent: Math.min(progress, 100).toFixed(0),
      },
    }));
  } catch (err) {
    console.error("Error fetching delivery status", err);
  }

  setLoading(false);
};



  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <button onClick={onBack} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        Back
      </button>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order.orderId} className="border p-4 rounded-xl shadow bg-white">
              <div className="flex gap-4">
                <img src={order.image} alt={order.name} className="w-24 h-24 object-contain" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{order.name}</h3>
                  <p>{order.description}</p>
                  <p className="font-bold">{order.cost}</p>
                  <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
                  <button
                    className="mt-2 bg-gray-800 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusClick(order)} 
                    disabled={loading}
                  >
                    {statusCardId === order.orderId ? "Hide Status" : "Check Delivery Status"}
                  </button>
                </div>
              </div>

              {statusCardId === order.orderId && (
                <div className={`mt-4 p-4 rounded ${getStatusColor(deliveryInfo[order.orderId]?.status)}`}>
                  <p className="font-bold mb-2">Delivery Status: {deliveryInfo[order.orderId]?.status}</p>
                  <div className="h-2 bg-gray-300 rounded-full mb-2">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${deliveryInfo[order.orderId]?.progressPercent || 0}%` }}
                    ></div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><strong>Order ID:</strong> {order.orderId}</li>
                    <li><strong>Started On:</strong> {new Date(deliveryInfo[order.orderId]?.createdAt).toLocaleString()}</li>
                    <li><strong>Distance Covered:</strong> {deliveryInfo[order.orderId]?.distanceCovered} km</li>
                    <li><strong>Estimated Arrival:</strong> {deliveryInfo[order.orderId]?.eta}</li>
                    <li><strong>Time Remaining:</strong> {deliveryInfo[order.orderId]?.remaining}</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
