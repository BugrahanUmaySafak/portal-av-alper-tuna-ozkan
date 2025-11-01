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
  const createdStr = new Date(contact.createdAt).toLocaleString("tr-TR");

  const handleNavigate = () => navigateTo && r.push(navigateTo);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Card
      onClick={handleNavigate}
      role={navigateTo ? "button" : undefined}
      tabIndex={navigateTo ? 0 : -1}
      className={[
        "w-full border border-border/60 shadow-sm transition-shadow",
        navigateTo
          ? "cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          : "hover:shadow-md",
      ].join(" ")}
      aria-label={navigateTo ? "İletişim detayına git" : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle
              className="text-lg font-semibold text-foreground truncate"
              title={contact.title}
            >
              {contact.title}
            </CardTitle>
            <div className="mt-2">
              <Badge className="text-[12px] font-medium">{createdStr}</Badge>
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
          <Row label="Ad Soyad" value={contact.name} />

          {contact.email && (
            <Row
              label="E-posta"
              value={
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline break-all"
                  onClick={stop}
                >
                  {contact.email}
                </a>
              }
            />
          )}

          {contact.phone && (
            <Row
              label="Telefon"
              value={
                <a
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 hover:underline break-all"
                  onClick={stop}
                >
                  {contact.phone}
                </a>
              }
            />
          )}

          <div className="pt-2">
            <div className="text-muted-foreground font-medium mb-1">Mesaj</div>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground break-words">
              {contact.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode | string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
      <span className="w-36 min-w-36 text-muted-foreground font-medium">
        {label}
      </span>
      <span className="min-w-0 break-words">{value}</span>
    </div>
  );
}
