import Link from "next/link";

const highlights = [
  {
    title: "Deliveries in minutes",
    description: "Drop two addresses and we calculate price, route, and payout on the fly.",
  },
  {
    title: "Couriers keep 70%",
    description: "Stripe Connect pays them automatically when a job is marked delivered.",
  },
  {
    title: "Built for phones",
    description: "Thumb-ready UI, instant maps, and multilingual copy for five launch markets.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-white to-orange-50">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-16 pt-20 text-center sm:pt-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Courier Connect</p>
        <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">
          Get anything across town without the awkward phone calls.
        </h1>
        <p className="text-lg text-gray-700 sm:text-xl">
          Customers book in seconds. Couriers see nearby jobs, accept with one tap, and keep most of the money. That is the entire business model.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/delivery"
            className="rounded-full bg-orange-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-orange-300/60 transition hover:bg-orange-600"
          >
            Book a delivery
          </Link>
          <Link
            href="/courier/signup"
            className="rounded-full border border-orange-200 px-8 py-3 text-base font-semibold text-orange-700 transition hover:border-orange-400"
          >
            Become a courier
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-20 sm:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border border-yellow-100 bg-white/80 p-6 text-left shadow-sm">
            <h2 className="text-lg font-semibold text-orange-700">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
