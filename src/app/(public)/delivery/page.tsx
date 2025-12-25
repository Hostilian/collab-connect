"use client";
// Look, either you want something delivered or you don't. Let's make it easy.
import AddressInput from "@/features/delivery/components/AddressInput";
import RouteMap from "@/features/delivery/components/RouteMap";
import {
  calculatePrice,
  type ItemType,
  type PricingResult,
  type SupportedCurrency,
} from "@/services/delivery/pricing";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function DeliveryFormPage() {
  const t = useTranslations();
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [itemType, setItemType] = useState<ItemType>("envelope");
  const [currency, setCurrency] = useState<SupportedCurrency>("CZK");
  const [quote, setQuote] = useState<PricingResult | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  // Callback to receive distance from RouteMap
  function handleDistanceUpdate(km: number | null) {
    setDistanceKm(km);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (distanceKm && date) {
      const scheduledDate = new Date(`${date}T${time || "12:00"}`);
      const result = calculatePrice({
        distanceKm,
        scheduledDate,
        itemType,
        currency,
      });
      setQuote(result);
    } else {
      setQuote(null);
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
          <select
            value={itemType}
            onChange={e => setItemType(e.target.value as ItemType)}
            className="mt-1 block w-full rounded border border-gray-300 p-2"
          >
            <option value="envelope">{t("form.envelope")}</option>
            <option value="small_package">{t("form.small_package")}</option>
            <option value="medium_package">{t("form.medium_package")}</option>
            <option value="large_package">{t("form.large_package")}</option>
            <option value="fragile">{t("form.fragile")}</option>
          </select>
        </label>
        <label className="font-semibold text-gray-800">
          {t("form.currency")}
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value as SupportedCurrency)}
            className="mt-1 block w-full rounded border border-gray-300 p-2"
          >
            <option value="CZK">CZK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="UAH">UAH</option>
            <option value="TRY">TRY</option>
          </select>
        </label>
        <button type="submit" className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition">
          {t("form.submit")}
        </button>
        {quote && (
          <div className="mt-4 space-y-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            <dl className="space-y-1">
              <div className="flex justify-between font-semibold text-lg">
                <dt>{t("form.price")}</dt>
                <dd>
                  {quote.totalPrice.toLocaleString()} {quote.currency}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>{t("form.courier")}</dt>
                <dd>
                  {quote.courierEarning.toLocaleString()} {quote.currency}
                </dd>
              </div>
              <div className="flex justify-between text-yellow-700">
                <dt>{t("form.platform")}</dt>
                <dd>
                  {quote.platformFee.toLocaleString()} {quote.currency}
                </dd>
              </div>
            </dl>
            <p className="text-xs text-yellow-700">
              {t("form.breakdown", {
                base: quote.breakdown.baseDistance,
                time: t(`form.urgency.${quote.breakdown.urgencyLabel}`),
                item: t(`form.${itemType}`),
              })}
            </p>
          </div>
        )}
      </form>
      <div className="w-full max-w-md mt-6">
        <RouteMap pickup={pickup} delivery={delivery} onDistanceUpdate={handleDistanceUpdate} />
      </div>
    </main>
  );
}
