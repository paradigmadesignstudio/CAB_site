import { PremiumSectionHeader } from "@/pages/components/premium";
import { Avatar, AvatarFallback, AvatarImage } from "@/pages/ui/avatar";
import type { BlogPost } from "@/pages/blog/types";

interface AuthorCardProps {
  author: BlogPost["author"];
}

function authorPhoto(avatar: string): string | null {
  const value = avatar.trim();

  if (value === "" || value.includes("placehold.co")) {
    return null;
  }

  return value;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const photo = authorPhoto(author.avatar);

  return (
    <section>
      <PremiumSectionHeader label="Autor" title="Sobre quem escreveu" />
      <div className="flex items-start gap-4 rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] sm:p-8">
        <Avatar className="h-16 w-16 rounded-full border border-[#003B7A]/10 sm:h-20 sm:w-20">
          {photo && <AvatarImage src={photo} alt={author.name} className="object-cover" />}
          <AvatarFallback className="bg-[#003B7A]/8 text-lg font-bold text-[#003B7A]">
            {author.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-black text-[#003B7A]">{author.name}</h4>
          <p className="mt-2 text-sm leading-relaxed text-[#003B7A]/65">{author.bio}</p>
        </div>
      </div>
    </section>
  );
}
