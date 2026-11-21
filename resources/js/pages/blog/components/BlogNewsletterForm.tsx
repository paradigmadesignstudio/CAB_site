import { useState } from "react";
import { Button } from "@/pages/ui/button";
import { cn } from "@/lib/utils";
import { formatPhoneInput, isPhoneValid } from "@/lib/phoneFormat";
import {
  getNewsletterErrorMessage,
  submitBlogNewsletter,
} from "@/pages/blog/services/submitNewsletter";

type BlogNewsletterFormVariant = "compact" | "featured";

interface BlogNewsletterFormProps {
  tipo: string;
  variant?: BlogNewsletterFormVariant;
  buttonLabel?: string;
  className?: string;
}

export function BlogNewsletterForm({
  tipo,
  variant = "compact",
  buttonLabel = "Quero receber",
  className,
}: BlogNewsletterFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const isCompact = variant === "compact";

  const inputClassName = cn(
    "w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 focus:ring-2 focus:ring-secondary/50 outline-none transition-all disabled:opacity-60",
    isCompact ? "h-9 px-3 rounded-lg text-sm" : "h-11 px-4 rounded-xl text-sm",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setFeedback({ type: "error", message: "Informe seu nome." });
      return;
    }

    if (!email.trim()) {
      setFeedback({ type: "error", message: "Informe seu e-mail." });
      return;
    }

    const trimmedPhone = phone.trim();

    if (trimmedPhone && !isPhoneValid(trimmedPhone)) {
      setFeedback({
        type: "error",
        message:
          "Informe um telefone completo: (11) 99999-9999 ou internacional começando com +.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await submitBlogNewsletter({
        name: name.trim(),
        email: email.trim(),
        phone: trimmedPhone || undefined,
        tipo,
      });

      setFeedback({
        type: "success",
        message: response.message || "Inscrição recebida! Em breve você receberá nossos conteúdos.",
      });
      setName("");
      setPhone("");
      setEmail("");
    } catch (error) {
      setFeedback({ type: "error", message: getNewsletterErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative z-10", className)}>
      <div className={cn("grid gap-2", isCompact ? "" : "sm:grid-cols-2")}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome"
          disabled={isSubmitting}
          autoComplete="name"
          className={inputClassName}
        />
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
          placeholder="Telefone (opcional)"
          disabled={isSubmitting}
          inputMode="tel"
          autoComplete="tel"
          maxLength={24}
          className={inputClassName}
        />
      </div>

      <div className={cn("mt-2", isCompact ? "space-y-2" : "flex flex-col sm:flex-row gap-2")}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Seu melhor e-mail"
          disabled={isSubmitting}
          autoComplete="email"
          className={cn(inputClassName, !isCompact && "sm:flex-1")}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold disabled:opacity-60 disabled:cursor-not-allowed",
            isCompact
              ? "h-9 w-full rounded-lg text-sm"
              : "h-11 px-6 rounded-xl shadow-xl sm:shrink-0",
          )}
        >
          {isSubmitting ? "Enviando..." : buttonLabel}
        </Button>
      </div>

      {feedback && (
        <p
          role="status"
          className={cn(
            "text-xs mt-2 text-center",
            feedback.type === "success" ? "text-secondary" : "text-red-300",
          )}
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
