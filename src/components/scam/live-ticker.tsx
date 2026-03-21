
"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export function LiveTicker() {
  const t = useTranslations("LiveAlerts");
  
  // Get the array of alerts from messages.json
  // In next-intl, arrays can be tricky, so we use raw if needed or multiple keys
  // For simplicity, I'll access them by index if the library allows or use a loop
  const alerts = [0, 1, 2, 3, 4].map(idx => t(`alerts.${idx}`));

  return (
    <div className="bg-destructive text-white py-2 overflow-hidden border-y border-white/10 relative">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex items-center gap-2 bg-destructive pr-4 z-10 font-bold shrink-0">
          <AlertTriangle className="w-4 h-4" />
          <span>{t("label")}</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="live-ticker flex gap-12">
            {alerts.concat(alerts).map((alert, i) => (
              <span key={i} className="text-sm font-medium whitespace-nowrap">
                • {alert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
