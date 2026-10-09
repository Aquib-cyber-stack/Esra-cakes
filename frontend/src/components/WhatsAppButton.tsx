import { useSiteConfig } from "@/context/SiteConfigContext";
import { whatsappLink } from "@/lib/format";

interface Props {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({ message = "Hi Esra Cakes! I'd like to ask about a cake.", className, children }: Props) {
  const { whatsappNumber } = useSiteConfig();
  if (!whatsappNumber) return null;

  return (
    <a
      href={whatsappLink(whatsappNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className || "btn btn-primary"}
    >
      {children || "Message us on WhatsApp"}
    </a>
  );
}
