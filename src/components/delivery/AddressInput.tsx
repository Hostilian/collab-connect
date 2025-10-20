// Well, would you look at that. It's a Google Maps address input.
import { useRef, useEffect } from "react";

export default function AddressInput({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
      types: ["address"],
      componentRestrictions: { country: [] }, // All countries
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });
    // Turns out, Google likes to leak memory. Clean up.
    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 block w-full rounded border border-gray-300 p-2"
      required
      autoComplete="off"
    />
  );
}
