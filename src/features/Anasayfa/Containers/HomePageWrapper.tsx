"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import LatestVideo from "../Components/LatestVideo";
import LatestArticle from "../Components/LatestArticle";
import LatestContact from "../Components/LatestContact";
import LatestInformative from "../Components/LatestInformative";

export default function HomePageWrapper() {
  return (
    <Section>
      <Container>
        <LatestContact />

        <div
          className="
            mt-6
            flex flex-col gap-12
            md:flex-row md:items-start
          "
        >
          {/* Sol sütun — Video */}
          <div className="w-full md:max-w-xl">
            <LatestVideo />
          </div>

          {/* Sağ sütun — Makale (sağa yaslı) */}
          <div className="w-full md:max-w-xl md:ml-auto">
            <LatestArticle />
          </div>
        </div>
      </Container>

      {/* Alt bilgi içerik bloğu: container dışında tam genişlik */}
      <LatestInformative />
    </Section>
  );
}
