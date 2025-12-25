"use client";
// Courier dashboard: see available jobs, accept them, track earnings.
import { useEffect, useState } from "react";

type Delivery = {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  totalPrice: number;
  courierPayout: number;
  status: string;
  itemType: string;
  scheduledDate: string;
};

export default function CourierDashboardPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  async function fetchDeliveries() {
    try {
      const res = await fetch("/api/deliveries?status=PENDING");
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data);
      }
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    } finally {
      setLoading(false);
    }
  }

  async function acceptJob(id: string, payout: number) {
    try {
      const res = await fetch(`/api/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });
      if (res.ok) {
        setDeliveries(deliveries.filter((d) => d.id !== id));
        setEarnings(earnings + payout);
      }
    } catch (err) {
      console.error("Failed to accept job", err);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-100">
        <p className="text-orange-700">Loading jobs...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-orange-50 via-white to-orange-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Courier Dashboard</h1>
      <div className="mb-6 text-lg font-semibold text-green-700">
        Session Earnings: {earnings} CZK
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Available Jobs</h2>
        {deliveries.length === 0 ? (
          <p className="text-gray-600">No jobs available right now. Check back soon!</p>
        ) : (
          <ul className="space-y-4">
            {deliveries.map((d) => (
              <li key={d.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div>
                  <strong>Pickup:</strong> {d.pickupAddress}
                </div>
                <div>
                  <strong>Dropoff:</strong> {d.dropoffAddress}
                </div>
                <div>
                  <strong>Item:</strong> {d.itemType.replace("_", " ")}
                </div>
                <div>
                  <strong>Scheduled:</strong>{" "}
                  {new Date(d.scheduledDate).toLocaleString()}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-700 font-bold">
                    You earn: {d.courierPayout} CZK
                  </span>
                  <button
                    onClick={() => acceptJob(d.id, d.courierPayout)}
                    className="bg-orange-500 text-white font-bold py-1 px-4 rounded hover:bg-orange-600 transition"
                  >
                    Accept
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
