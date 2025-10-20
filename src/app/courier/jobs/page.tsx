"use client";
// Well, would you look at that. It's a real-time job board for couriers.

import dynamic from "next/dynamic";
import { useState } from "react";

// Lazy-load the map so it doesn't break SSR
const JobMap = dynamic(() => import("@/components/courier/JobMap"), { ssr: false });

const mockJobs = [
  { id: 1, pickup: "Prague, Wenceslas Square", delivery: "Prague, Main Train Station", price: 120, status: "pending" },
  { id: 2, pickup: "Berlin, Alexanderplatz", delivery: "Berlin, Zoo Station", price: 200, status: "pending" },
  { id: 3, pickup: "Istanbul, Taksim", delivery: "Istanbul, Kadikoy", price: 180, status: "pending" },
];

export default function CourierJobsPage() {
  const [jobs, setJobs] = useState(mockJobs);

  function acceptJob(id: number) {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: "accepted" } : job));
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-orange-50 via-white to-orange-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Available Delivery Jobs</h1>
      <div className="w-full max-w-md mb-6">
        <JobMap />
      </div>
      <div className="w-full max-w-md">
        <ul className="space-y-4">
          {jobs.map(job => (
            <li key={job.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
              <div><strong>Pickup:</strong> {job.pickup}</div>
              <div><strong>Delivery:</strong> {job.delivery}</div>
              <div><strong>Price:</strong> {job.price} CZK</div>
              <div><strong>Status:</strong> {job.status}</div>
              {job.status === "pending" && (
                <button onClick={() => acceptJob(job.id)} className="bg-orange-500 text-white font-bold py-1 px-3 rounded hover:bg-orange-600 transition">Accept Job</button>
              )}
              {job.status === "accepted" && (
                <span className="text-green-700 font-semibold">Accepted</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
