"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import LatestContact from "../Components/LatestContact";
import LatestVideo from "../Components/LatestVideo";

export default function HomePageWrapper() {
  return (
    <Container>
      <Section>
          <LatestContact />
          <br />
          <LatestVideo />
      </Section>
    </Container>
  );
}
