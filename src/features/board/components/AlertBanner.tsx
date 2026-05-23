// components/AlertBanner.tsx

import { ShieldAlert } from "lucide-react";

interface Props {
  message: string;
}

export default function AlertBanner({ message }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3">
      <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
      <p className="text-xs font-semibold">{message}</p>
    </div>
  );
}
