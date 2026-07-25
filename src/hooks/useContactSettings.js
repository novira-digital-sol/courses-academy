import { contactSettings } from "../data/staticData";

export const whatsappLink = (number) => {
  const digits = String(number || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
};

const useContactSettings = () => {
  return { contactSettings, loading: false };
};

export default useContactSettings;
