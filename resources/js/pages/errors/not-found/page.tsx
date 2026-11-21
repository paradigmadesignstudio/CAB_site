import { NotFound } from "@/pages/components/NotFound";

export interface NotFoundPageProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
}

export default function NotFoundPage({
  title = "Página não encontrada",
  backHref = "/",
  backLabel = "Voltar para a home",
}: NotFoundPageProps) {
  return <NotFound title={title} backHref={backHref} backLabel={backLabel} />;
}
