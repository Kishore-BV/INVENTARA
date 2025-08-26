
import React from "react";

const inventorySummary = [
  { label: "Total Items", value: 97 },
  { label: "Low Stock", value: 8 },
  { label: "Out of Stock", value: 2 },
  { label: "Suppliers", value: 5 },
];

const inventoryData = [
  { id: 1, name: "Laptop", quantity: 12, supplier: "Dell", status: "In Stock" },
  { id: 2, name: "Mouse", quantity: 3, supplier: "Logitech", status: "Low Stock" },
  { id: 3, name: "Keyboard", quantity: 0, supplier: "HP", status: "Out of Stock" },
  { id: 4, name: "Monitor", quantity: 5, supplier: "Samsung", status: "In Stock" },
];

export const DashboardInventoryContent = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {inventorySummary.map((item) => (
          <div key={item.label} className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-lg font-semibold text-gray-700">{item.label}</div>
            <div className="text-2xl font-bold text-blue-600">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Item</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Supplier</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">{item.supplier}</td>
                <td className="py-2 px-4">
                  <span
                    className={
                      item.status === "In Stock"
                        ? "text-green-600 font-semibold"
                        : item.status === "Low Stock"
                        ? "text-yellow-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
