"use client";

import { Skeleton } from "@/components/ui/skeleton";
import ContactCard from "@/features/iletisim/components/ContactCard";
import { useContacts } from "@/features/iletisim/hooks/useContacts";

export default function LatestContact() {
  const { contacts, isLoading, isError } = useContacts();

  if (isLoading) return <Skeleton className="h-28 w-full" />;

  if (isError || !contacts.length) {
    return (
      <div className="text-muted-foreground text-base">
        Henüz iletişim kaydı yok.
      </div>
    );
  }

  const latest = contacts[0];

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Son Gönderilen Mesaj
        </h1>
      </div>

      {/* Son iletişim kartı */}
      <ContactCard contact={latest} showDelete={false} navigateTo="/iletisim" />
    </div>
  );
}
