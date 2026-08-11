import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface PublicProfile {
  id: string;
  gender: "homme" | "femme";
  age: number | null;
  city: string | null;
  occupation: string | null;
}

const sentinelByGender = {
  femme: "/images/stock/profile-sentinel-woman.webp",
  homme: "/images/stock/profile-sentinel-man.webp",
};

export function ProfileCard({ profile }: { profile: PublicProfile }) {
  const genderLabel = profile.gender === "femme" ? "Femme" : "Homme";

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-4/5 overflow-hidden bg-secondary">
        <Image
          src={sentinelByGender[profile.gender]}
          alt={`Profil ${genderLabel.toLowerCase()} Lomdie`}
          fill
          sizes="280px"
          className="object-cover"
        />
      </div>

      <div className="flex min-h-40 flex-col p-5 text-center">
        <h3 className="font-display text-lg">
          {genderLabel}
          {profile.age ? ` · ${profile.age} ans` : ""}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {[profile.occupation, profile.city].filter(Boolean).join(" · ")}
        </p>
        <Button
          render={<Link href="/candidature" />}
          variant="outline"
          size="sm"
          className="mt-auto w-full"
        >
          Voir le profil
        </Button>
      </div>
    </div>
  );
}
