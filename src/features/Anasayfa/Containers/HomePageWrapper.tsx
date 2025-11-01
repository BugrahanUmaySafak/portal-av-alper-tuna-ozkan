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

        {/* ana sitedeki 3 sütun hissi: sol video, ortada boş, sağda makale */}
        <div className="mt-6 grid gap-10 lg:grid-cols-3 items-start">
          {/* 1. sütun: video */}
          <div className="flex justify-start">
            <LatestVideo />
          </div>

          {/* 2. sütun: boş */}
          <div className="hidden lg:block" />

          {/* 3. sütun: makale */}
          <div className="flex justify-end">
            <LatestArticle />
          </div>
        </div>
      </Container>

      {/* alt blok aynı kalsın */}
      <LatestInformative />
    </Section>
  );
}
