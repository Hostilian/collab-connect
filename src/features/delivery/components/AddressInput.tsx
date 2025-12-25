// Well, would you look at that. It's a Google Maps address input.
import { useEffect, useRef } from "react";

interface AddressInputProps {
  readonly value: string;
  readonly onChange: (val: string) => void;
  readonly placeholder: string;
}

export default function AddressInput({ value, onChange, placeholder }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const google = (globalThis as typeof globalThis & { google?: { maps?: { places: { Autocomplete: new (input: HTMLInputElement, opts: object) => { getPlace: () => { formatted_address?: string }; addListener: (event: string, handler: () => void) => void } }; event: { clearInstanceListeners: (target: object) => void } } } }).google;
    if (!google?.maps) return;
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
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
      google.maps?.event.clearInstanceListeners(autocomplete);
    };
  }, [onChange]);

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
