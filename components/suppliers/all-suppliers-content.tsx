import React from "react";

const suppliers = [
  { id: 1, name: "Dell", contact: "dell@example.com", status: "Active" },
  { id: 2, name: "Logitech", contact: "logitech@example.com", status: "Active" },
  { id: 3, name: "Samsung", contact: "samsung@example.com", status: "Inactive" },
];

export function AllSuppliersContent() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Suppliers</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Contact</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td className="py-2 px-4 border-b">{supplier.name}</td>
              <td className="py-2 px-4 border-b">{supplier.contact}</td>
              <td className="py-2 px-4 border-b">{supplier.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
