"use client";
// Look, either you want something delivered or you don't. Let's make it easy.
import AddressInput from "@/components/delivery/AddressInput";
import RouteMap from "@/components/delivery/RouteMap";
import { calculatePrice } from "@/lib/pricing";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function DeliveryFormPage() {
  const t = useTranslations();
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [itemType, setItemType] = useState("envelope");
  const [price, setPrice] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  // Callback to receive distance from RouteMap
  function handleDistanceUpdate(km: number | null) {
    setDistanceKm(km);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (distanceKm && date) {
      const scheduledDate = new Date(date + 'T' + (time || '12:00'));
  const result = calculatePrice({ distanceKm, scheduledDate, itemType: itemType as 'envelope' | 'small_package' | 'medium_package' | 'large_package' | 'fragile' });
      setPrice(result.totalPrice);
    } else {
      setPrice(null);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-100 via-white to-yellow-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2 text-yellow-700">{t("app.title")}</h1>
      <p className="mb-6 text-gray-700">{t("app.description")}</p>
      <form className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="font-semibold text-gray-800">
          {t("form.pickup")}
          <AddressInput value={pickup} onChange={setPickup} placeholder={t("form.pickup")} />
        </label>
        <label className="font-semibold text-gray-800">
          {t("form.delivery")}
          <AddressInput value={delivery} onChange={setDelivery} placeholder={t("form.delivery")} />
        </label>
        <label className="font-semibold text-gray-800">
          {t("form.date")}
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
        </label>
        <label className="font-semibold text-gray-800">
          {t("form.time")}
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
        </label>
        <label className="font-semibold text-gray-800">
          {t("form.itemType")}
          <select value={itemType} onChange={e => setItemType(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 p-2">
            <option value="envelope">{t("form.envelope")}</option>
            <option value="small_package">{t("form.small_package")}</option>
            <option value="medium_package">{t("form.medium_package")}</option>
            <option value="large_package">{t("form.large_package")}</option>
            <option value="fragile">{t("form.fragile")}</option>
          </select>
        </label>
        <button type="submit" className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition">
          {t("form.submit")}
        </button>
        {price !== null && (
          <div className="mt-4 text-lg font-semibold text-yellow-700">
            {t("form.price")}: {price} CZK
          </div>
        )}
      </form>
      <div className="w-full max-w-md mt-6">
        <RouteMap pickup={pickup} delivery={delivery} onDistanceUpdate={handleDistanceUpdate} />
      </div>
    </main>
  );
}
