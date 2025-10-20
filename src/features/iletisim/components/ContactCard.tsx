"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ContactDelete from "./ContactDelete";
import type { Contact } from "@/features/iletisim/hooks/useContacts";

export default function ContactCard({
  contact,
  showDelete = true,
  onDeleted,
  navigateTo,
}: {
  contact: Contact;
  showDelete?: boolean;
  onDeleted?: () => void;
  navigateTo?: string;
}) {
  const r = useRouter();

  const handleNavigate = () => {
    if (!navigateTo) return;
    r.push(navigateTo);
  };

  const createdStr = new Date(contact.createdAt).toLocaleString("tr-TR");

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Card
      onClick={handleNavigate}
      role={navigateTo ? "button" : undefined}
      tabIndex={navigateTo ? 0 : -1}
      className={[
        "w-full border border-border/60 shadow-sm transition-shadow",
        navigateTo
          ? "cursor-pointer hover:shadow-md focus:outline-none"
          : "hover:shadow-md",
      ].join(" ")}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground">
              {contact.title}
            </CardTitle>
            <div className="mt-2">
              <Badge
                variant="secondary"
                className="text-[12px] font-medium bg-muted/40 text-foreground/90"
              >
                {createdStr}
              </Badge>
            </div>
          </div>

          {showDelete && (
            <div onClick={stop}>
              <ContactDelete id={contact.id} onDeleted={onDeleted} />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 text-base text-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <span className="w-36 text-muted-foreground font-medium">
              Ad Soyad
            </span>
            <span>{contact.name}</span>
          </div>

          {contact.email && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="w-36 text-muted-foreground font-medium">
                E-posta
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="text-blue-600 hover:underline"
                onClick={stop}
              >
                {contact.email}
              </a>
            </div>
          )}

          {contact.phone && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="w-36 text-muted-foreground font-medium">
                Telefon
              </span>
              <a
                href={`tel:${contact.phone}`}
                className="text-blue-600 hover:underline"
                onClick={stop}
              >
                {contact.phone}
              </a>
            </div>
          )}

          <div className="pt-2">
            <div className="text-muted-foreground font-medium mb-1">Mesaj</div>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">
              {contact.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
