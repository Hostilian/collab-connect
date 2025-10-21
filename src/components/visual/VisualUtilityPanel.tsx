"use client";
// Visual and utility API panel: Unsplash, QR Code, IPify, News, JSONPlaceholder, Mocki.io
import { getFakeUsers, getMockData, getNews, getPublicIP, getQRCodeUrl, getUnsplashImages } from "@/lib/visual-utility";
import Image from "next/image";
import { useState } from "react";

interface UnsplashImage {
  id: string;
  urls: { thumb: string };
  alt_description: string;
}
interface NewsArticle {
  title: string;
  url: string;
}
interface FakeUser {
  id: number;
  name: string;
  email: string;
}

export default function VisualUtilityPanel() {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [ip, setIP] = useState<string>("");
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [users, setUsers] = useState<FakeUser[]>([]);
  const [qr, setQR] = useState<string>("");
  const [mock, setMock] = useState<object | null>(null);

  return (
    <div className="p-4 space-y-4">
      <button className="px-4 py-1 bg-gray-700 text-white rounded" onClick={async () => {
        setImages(await getUnsplashImages("collaboration"));
      }}>Get Unsplash Images</button>
      {images.length > 0 && (
        <div className="flex gap-2 mt-2">
          {images.map((img) => (
            <Image key={img.id} src={img.urls.thumb} alt={img.alt_description || "Unsplash image"} width={100} height={100} className="rounded shadow" />
          ))}
        </div>
      )}
      <button className="px-4 py-1 bg-blue-700 text-white rounded" onClick={async () => {
        setIP(await getPublicIP());
      }}>Get My IP</button>
      {ip && <div className="mt-2">Your IP: {ip}</div>}
      <button className="px-4 py-1 bg-green-700 text-white rounded" onClick={async () => {
        setNews(await getNews("collaboration"));
      }}>Get News</button>
      {news.length > 0 && (
        <ul className="mt-2 space-y-2">
          {news.map((n, i) => (
            <li key={i} className="bg-white rounded p-2 shadow"><a href={n.url} target="_blank" rel="noopener noreferrer">{n.title}</a></li>
          ))}
        </ul>
      )}
      <button className="px-4 py-1 bg-purple-700 text-white rounded" onClick={async () => {
        setUsers(await getFakeUsers());
      }}>Get Fake Users</button>
      {users.length > 0 && (
        <ul className="mt-2 space-y-2">
          {users.map((u) => (
            <li key={u.id} className="bg-white rounded p-2 shadow">{u.name} ({u.email})</li>
          ))}
        </ul>
      )}
      <button className="px-4 py-1 bg-pink-700 text-white rounded" onClick={() => {
        setQR(getQRCodeUrl("collab-connect"));
      }}>Get QR Code</button>
      {qr && <Image src={qr} alt="QR Code" width={200} height={200} className="mt-2 rounded shadow" />}
      <button className="px-4 py-1 bg-yellow-700 text-white rounded" onClick={async () => {
        setMock(await getMockData("b043df5a-3b3c-4c2a-8b2c-9c3e5e8e8e8e"));
      }}>Get Mock Data</button>
      {mock && <pre className="mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(mock, null, 2)}</pre>}
    </div>
  );
}
