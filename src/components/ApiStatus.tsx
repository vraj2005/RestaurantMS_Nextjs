"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axiosClient";
import { AlertCircle, CheckCircle, WifiOff, RefreshCw } from "lucide-react";

export default function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    checkConnection();
    const interval = setInterval(() => {
      checkConnection();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      setStatus("checking");
      await api.get("/tables", { timeout: 5000 });
      setStatus("connected");
      setErrorMsg("");
      setLastCheck(new Date());
    } catch (err: any) {
      setStatus("error");
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setErrorMsg("Server timeout - API not responding");
      } else if (!err.response) {
        setErrorMsg("Cannot reach server at https://resback.sampaarsh.cloud");
      } else if (err.response?.status === 401) {
        setErrorMsg("Authentication required");
        setStatus("connected");
      } else if (err.response?.status === 403) {
        setErrorMsg("Access forbidden - Check permissions");
        setStatus("connected");
      } else {
        setErrorMsg(`API Error: ${err.response?.data?.message || err.response?.status || "Unknown"}`);
      }
      setLastCheck(new Date());
    }
  };

  if (status === "connected") {
    return (
      <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg flex items-center gap-2 z-50">
        <CheckCircle className="text-green-600" size={18} />
        <div>
          <span className="text-xs font-medium text-green-700">API Connected</span>
          <p className="text-xs text-green-600">{lastCheck.toLocaleTimeString()}</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
        <div className="flex items-start gap-3">
          <WifiOff className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700 mb-1">API Connection Failed</p>
            <p className="text-xs text-red-600 mb-2">{errorMsg}</p>
            <p className="text-xs text-red-500 mb-3">Last: {lastCheck.toLocaleTimeString()}</p>
            <button
              onClick={checkConnection}
              className="flex items-center gap-2 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 font-medium"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg flex items-center gap-2 z-50">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span className="text-xs font-medium text-blue-700">Checking...</span>
    </div>
  );
}
