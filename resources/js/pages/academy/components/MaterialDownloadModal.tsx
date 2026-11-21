import { useState } from "react";
import type { Material } from "@/pages/academy/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/pages/ui/dialog";
import { Button } from "@/pages/ui/button";
import { formatPhoneInput, isPhoneValid } from "@/lib/phoneFormat";
import {
  getMaterialLeadErrorMessage,
  submitMaterialLead,
  triggerFileDownload,
} from "@/pages/academy/services/submitMaterialLead";

interface MaterialDownloadModalProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialDownloadModal({
  material,
  open,
  onOpenChange,
}: MaterialDownloadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setFeedback(null);
    setIsSubmitting(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!material || isSubmitting) return;

    if (!name.trim()) {
      setFeedback({ type: "error", message: "Informe seu nome." });
      return;
    }

    if (!isPhoneValid(phone)) {
      setFeedback({
        type: "error",
        message: "Informe um telefone completo: (11) 99999-9999 ou internacional começando com +.",
      });
      return;
    }

    if (!email.trim()) {
      setFeedback({ type: "error", message: "Informe seu e-mail." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await submitMaterialLead({
        name: name.trim(),
        phone,
        email: email.trim(),
        material_slug: material.slug,
      });

      setFeedback({ type: "success", message: response.message });
      triggerFileDownload(response.downloadUrl);

      window.setTimeout(() => {
        handleOpenChange(false);
      }, 1200);
    } catch (error) {
      setFeedback({ type: "error", message: getMaterialLeadErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#003B7A]">Baixar material gratuito</DialogTitle>
          <DialogDescription>
            Preencha seus dados para liberar o download de{" "}
            <span className="font-semibold text-[#003B7A]">{material?.title}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            disabled={isSubmitting}
            autoComplete="name"
            className="h-11 w-full rounded-xl border border-[#003B7A]/15 px-4 text-sm outline-none transition-colors focus:border-[#009739]"
          />
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
            placeholder="(11) 99999-9999"
            disabled={isSubmitting}
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            className="h-11 w-full rounded-xl border border-[#003B7A]/15 px-4 text-sm outline-none transition-colors focus:border-[#009739]"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Seu melhor e-mail"
            disabled={isSubmitting}
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-[#003B7A]/15 px-4 text-sm outline-none transition-colors focus:border-[#009739]"
          />

          {feedback && (
            <p
              role="status"
              className={`text-sm ${feedback.type === "success" ? "text-[#009739]" : "text-red-600"}`}
            >
              {feedback.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-[#009739] font-bold text-white hover:bg-[#00b344]"
          >
            {isSubmitting ? "Liberando download..." : "Receber material"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
