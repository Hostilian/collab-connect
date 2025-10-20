"use client";
// Well, would you look at that. It's a courier dashboard with jobs and earnings.
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";




type Job = {
  id: number;
  pickup: string;
  delivery: string;
  price: number;
  status: string;
};

export default function CourierDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    // Fetch jobs from Supabase
    async function fetchJobs() {
      const { data, error } = await supabase.from("jobs").select("*");
      if (!error && data) setJobs(data);
    }
    fetchJobs();

    // Subscribe to real-time job updates
    const subscription = supabase
      .channel('jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, _payload => {
        fetchJobs();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function acceptJob(id: number) {
    // Update job status in Supabase
    const { error } = await supabase
      .from("jobs")
      .update({ status: "accepted" })
      .eq("id", id);
    if (!error) {
      setJobs(jobs.map(job => job.id === id ? { ...job, status: "accepted" } : job));
      const foundJob = jobs.find(job => job.id === id);
      setEarnings(earnings + (foundJob ? foundJob.price : 0));
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-orange-50 via-white to-orange-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Courier Dashboard</h1>
      <div className="mb-6 text-lg font-semibold text-green-700">Total Earnings: {earnings} CZK</div>
      <div className="w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Available Jobs</h2>
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
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
