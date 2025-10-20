"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import NewVideoForm from "@/features/videolarim/components/NewVideoForm";

export default function NewVideoWrapper() {
  return (
    <Section>
      <Container>
        <NewVideoForm />
      </Container>
    </Section>
  );
}
