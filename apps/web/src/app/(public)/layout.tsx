import { LayoutParams } from "@/types/next";
import { Footer } from "../_features/core/footer/footer";
import { Header } from "../_features/core/header/header.server";
import { LaunchBanner } from "../_features/core/launch-banner/launch-banner.client";

export default function PublicLayout({ children }: LayoutParams) {
  return (
    <div>
      <LaunchBanner />
      <Header />
      {children}

      <Footer />
    </div>
  )
}