"use client";

import { useAuth } from "@clerk/nextjs";

export function SomeComponent() {
  const { getToken } = useAuth();

  async function callApi() {
    const token = await getToken();
    const res = await fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(await res.json());
  }

  return (
    <button
      type="button"
      onClick={callApi}
      className="fixed bottom-14 right-4 z-[9999] rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-lg hover:bg-red-600 disabled:opacity-50"
    >
      {"Test API(dev)"}
    </button>
  );
}