// src/features/iletisim/components/ContactList.tsx
"use client";

import { useMemo, useState } from "react";
import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { Skeleton } from "@/components/ui/skeleton";
import ContactCard from "./ContactCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useContacts,
  type Contact,
} from "@/features/iletisim/hooks/useContacts";

export default function ContactList() {
  const { contacts, isLoading, isError, error, mutate } = useContacts();
  const [q, setQ] = useState("");

  const sorted = useMemo(() => {
    if (!contacts?.length) return [];
    return [...contacts].sort((a, b) => {
      const ta = +new Date(a.createdAt || 0);
      const tb = +new Date(b.createdAt || 0);
      return tb - ta; // yeni → eski
    });
  }, [contacts]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sorted;
    return sorted.filter((c) => {
      const haystack = [c.title, c.name, c.email, c.phone, c.content]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [q, sorted]);

  if (isLoading) {
    return (
      <Container>
        <Section>
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        </Section>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Section>
          <div className="flex items-center gap-3">
            <p className="text-destructive text-base font-medium">
              {error instanceof Error ? error.message : "Bir hata oluştu."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate(undefined, { revalidate: true })}
            >
              Yeniden Dene
            </Button>
          </div>
        </Section>
      </Container>
    );
  }

  if (!sorted.length) {
    return (
      <Container>
        <Section>
          <p className="text-muted-foreground text-base">
            Henüz iletişim kaydı yok.
          </p>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <h1 className="text-lg font-semibold">İletişim Kutusu</h1>
          <div className="sm:ml-auto w-full sm:w-80">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara: ad, e-posta, telefon, başlık, içerik…"
              aria-label="İletişim kayıtlarında ara"
            />
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.map((c: Contact) => (
            <ContactCard
              key={c.id || `${c.name}-${c.createdAt}`}
              contact={c}
              showDelete
              onDeleted={() => {
                mutate(
                  (prev?: Contact[]) =>
                    prev ? prev.filter((x) => x.id !== c.id) : prev,
                  { revalidate: false }
                );
              }}
            />
          ))}
          {!filtered.length && (
            <p className="text-muted-foreground text-sm">
              Aramanıza uygun sonuç bulunamadı.
            </p>
          )}
        </div>
      </Section>
    </Container>
  );
}
