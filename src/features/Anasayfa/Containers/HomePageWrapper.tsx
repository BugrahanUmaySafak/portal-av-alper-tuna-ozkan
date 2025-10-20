"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import LatestContact from "../Components/LatestContact";

export default function HomePageWrapper() {
  return (
    <Container>
      <Section>
        <LatestContact />
      </Section>
    </Container>
  );
}
