// src/app/kategoriler/page.tsx
"use client";

import Section from "@/components/section/Section";
import Container from "@/components/container/Container";
import CategoriesManager from "@/features/kategoriler/components/CategoriesManager";

export default function Page() {
  return (
    <Section>
      <Container>
        <h1 className="text-2xl font-semibold mb-6">Kategoriler</h1>
        <CategoriesManager />
      </Container>
    </Section>
  );
}
