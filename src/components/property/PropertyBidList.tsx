"use client";
// Property bidding list using Zillow and Land Registry APIs
import { searchZillowListings } from "@/lib/property-bidding";
import { useEffect, useState } from "react";

interface PropertyBidListProps {
  location: string;
}

interface ZillowListing {
  address: string;
  price: number;
  status: string;
}

export default function PropertyBidList({ location }: PropertyBidListProps) {
  const [listings, setListings] = useState<ZillowListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    searchZillowListings(location)
      .then((data) => {
        setListings(data.results || []);
        setError(null);
      })
      .catch((_err) => {
        setError("Failed to fetch listings");
      })
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Property Bids in {location}</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-4">
        {listings.map((listing, i) => (
          <li key={i} className="bg-white rounded shadow p-4">
            <div className="font-bold">{listing.address}</div>
            <div>Price: {listing.price}</div>
            <div>Status: {listing.status}</div>
            <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded">Bid</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
