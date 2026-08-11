"use client";

import { useApiFetch } from "@/lib/api/use-api-fetch";

export function SomeComponent() {
  const apiFetch = useApiFetch();

  if (process.env.NODE_ENV === "production") return null;

  async function callApi() {
    const data = await apiFetch("/api/me");
    console.log(data);
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