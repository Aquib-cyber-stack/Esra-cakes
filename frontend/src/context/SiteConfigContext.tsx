import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface SiteConfig {
  whatsappNumber: string;
  businessHours: { weekdays: string; saturday: string; sunday: string };
}

const defaultConfig: SiteConfig = {
  whatsappNumber: "",
  businessHours: { weekdays: "9:00 AM – 7:00 PM", saturday: "10:00 AM – 6:00 PM", sunday: "By appointment only" },
};

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    api
      .get("/config")
      .then((res) => setConfig(res.data))
      .catch(() => {});
  }, []);

  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
