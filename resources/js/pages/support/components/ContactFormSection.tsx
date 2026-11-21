import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import { Button } from "@/pages/ui/button";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { formatPhoneInput, isPhoneValid } from "@/lib/phoneFormat";
import {
  getContactFormErrorMessage,
  submitSupportContact,
} from "@/pages/support/services/submitContactForm";

const inputClassName =
  "w-full rounded-xl border border-[#003B7A]/15 bg-white px-4 py-3 text-[#003B7A] outline-none transition placeholder:text-[#003B7A]/35 focus:border-[#009739]/50 focus:ring-1 focus:ring-[#009739]/30 disabled:opacity-60";

export function ContactFormSection() {
  const useStaticMotion = useLightMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
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

    if (phone.trim() && !isPhoneValid(phone)) {
      setFeedback({
        type: "error",
        message:
          "Informe um telefone completo: (11) 99999-9999 ou internacional começando com +.",
      });
      return;
    }

    if (!subject.trim()) {
      setFeedback({ type: "error", message: "Informe o assunto." });
      return;
    }

    if (!message.trim()) {
      setFeedback({ type: "error", message: "Informe sua mensagem." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await submitSupportContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      setFeedback({
        type: "success",
        message: response.message || "Mensagem recebida com sucesso! Responderemos em breve.",
      });
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setFeedback({ type: "error", message: getContactFormErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="formulario" className="mx-auto max-w-3xl px-4 sm:px-6">
      <PremiumSectionHeader
        label="Formulário"
        title="Envie sua mensagem"
        description="Preencha o formulário abaixo e responderemos o mais rápido possível."
        className="mb-10 text-center md:mb-12 [&_h2]:mx-auto [&_p]:mx-auto"
      />

      <motion.form
        onSubmit={handleSubmit}
        initial={useStaticMotion ? false : { opacity: 0, y: 20 }}
        whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={useStaticMotion ? undefined : { once: true, margin: "-50px" }}
        transition={useStaticMotion ? undefined : { duration: 0.5, delay: 0.1 }}
        className="space-y-6 overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-8 shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)]"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/55"
            >
              Nome *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              className={inputClassName}
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/55"
            >
              E-mail *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              className={inputClassName}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="contact-phone"
            className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/55"
          >
            Telefone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
            disabled={isSubmitting}
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            className={inputClassName}
            placeholder="(11) 99999-9999 ou +55 11 99999-9999"
          />
        </div>
        <div>
          <label
            htmlFor="contact-subject"
            className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/55"
          >
            Assunto *
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            disabled={isSubmitting}
            className={inputClassName}
            placeholder="Ex: Dúvida sobre planos"
          />
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/55"
          >
            Mensagem *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isSubmitting}
            className={`${inputClassName} resize-y`}
            placeholder="Descreva sua necessidade..."
          />
        </div>

        {feedback && (
          <p
            role="status"
            className={`text-center text-sm ${
              feedback.type === "success" ? "text-[#009739]" : "text-red-600"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#003B7A] font-bold text-white shadow-[0_8px_24px_-10px_rgba(0,59,122,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#002B5A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar mensagem"}
          <Send className="h-4 w-4" />
        </Button>
      </motion.form>
    </div>
  );
}
