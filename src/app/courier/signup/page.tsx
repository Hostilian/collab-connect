"use client";
// Well, would you look at that. It's a courier signup form.
import { useState } from "react";

export default function CourierSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Look, either they're a real courier or they're not. Let's find out.
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-100 via-white to-orange-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Courier Registration</h1>
      <form className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="font-semibold text-gray-800">
          Name
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
        </label>
        <label className="font-semibold text-gray-800">
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
        </label>
        <label className="font-semibold text-gray-800">
          Phone
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
        </label>
        <label className="font-semibold text-gray-800">
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
        </label>
        <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition">
          Register as Courier
        </button>
        {submitted && (
          <div className="mt-4 text-green-700 font-semibold">Thanks for signing up! We'll verify your info and get you delivering soon.</div>
        )}
      </form>
    </main>
  );
}
