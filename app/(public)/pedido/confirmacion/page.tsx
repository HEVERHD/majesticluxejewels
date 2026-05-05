import { Suspense } from "react";
import ConfirmacionClient from "./ConfirmacionClient";

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4ef]">
        <div className="w-8 h-8 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    }>
      <ConfirmacionClient />
    </Suspense>
  );
}
