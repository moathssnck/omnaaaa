import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-center min-h-screen text-black">
        <Loader2 className=" animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500" />
        انتظر...
      </div>
    </div>
  );
}
