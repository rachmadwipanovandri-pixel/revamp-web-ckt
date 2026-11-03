import Image from "next/image";
import { cn } from "@/lib/utils";
import { WorkflowScene } from "./workflow-scene";

/** Existing Cekat artwork, composed as a product stage rather than wallpaper. */
export function ProductStage({
  image,
  imageAlt,
  photo,
  label,
  tone = "chat",
}: {
  image: string;
  imageAlt: string;
  photo?: string;
  label?: string;
  tone?: string;
}) {
  return (
    <div className={cn("product-stage product-stage--live", photo && "product-stage--photo")} data-tone={tone}>
      {photo && (
        <div className="product-stage__photo">
          <Image src={photo} alt={imageAlt} fill preload sizes="(max-width: 1024px) 90vw, 360px" className="object-cover" />
        </div>
      )}
      <WorkflowScene image={image} imageAlt={imageAlt} title={label} hero />
    </div>
  );
}

export const PRODUCT_ART: Record<string, string> = {
  chat: "/images/home/hero-dashboard.png",
  crm: "/images/crm/manage-work-with-boards.png",
  marketing: "/images/marketing/see-what-actually-works.png",
  order: "/images/order/full-visibility-across-every-automation-step.png",
  ai: "/images/chat/train-your-ai-agent.png",
};
