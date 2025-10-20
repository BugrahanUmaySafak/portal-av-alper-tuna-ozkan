"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { Skeleton } from "@/components/ui/skeleton";
import ContactCard from "./ContactCard";
import {
  useContacts,
  type Contact,
} from "@/features/iletisim/hooks/useContacts";

export default function ContactList() {
  const { contacts, isLoading, isError, error, mutate } = useContacts();

  if (isLoading) {
    return (
      <Container>
        <Section>
          <div className="grid gap-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </Section>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Section>
          <p className="text-destructive text-base font-medium">
            {error instanceof Error ? error.message : "Bir hata oluştu."}
          </p>
        </Section>
      </Container>
    );
  }

  if (!contacts.length) {
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
        <div className="grid gap-3">
          {contacts.map((c: Contact, index) => {
            const key = c.id || `${c.name}-${c.createdAt}-${index}`;
            return (
              <ContactCard
                key={key}
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
            );
          })}
        </div>
      </Section>
    </Container>
  );
}
