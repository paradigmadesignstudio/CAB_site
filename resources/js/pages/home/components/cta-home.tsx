import React, { useState } from "react"
import { submitHomeCta, getCtaErrorMessage } from "@/pages/home/services/submitCta"
import { formatPhoneInput, isPhoneValid } from "@/lib/phoneFormat"

const ctaData = {
  heading: "SUA VEZ DE CRESCER.",
  headingAccent: "#009739",
  namePlaceholder: "Seu nome",
  phonePlaceholder: "(11) 99999-9999 ou +55 11 99999-9999",
  placeholder: "seu@email.com",
  buttonText: "Começar",
  submittingText: "Entrando...",
  successText: "Recebemos seus dados! Em breve entraremos em contato.",
  smallText: "Conecte-se com a elite do mercado. Zero enrolação, foco em resultados.",
  paragraph:
    "A CAB é o aditivo de alta performance para o seu negócio, estruturada com suporte técnico real, zero burocracia e parcerias transparentes. Acelere a sua ambição sem fundir o motor.",
  buttonColor: "#009739",
}

const inputClassName =
  "w-full bg-white/5 border-2 border-black/20 rounded-xl px-4 py-2.5 text-black placeholder:text-black/40 font-mono text-sm focus:outline-none focus:border-[#AFFF00] transition-all duration-300"

interface CtaFieldProps {
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  disabled?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
  maxLength?: number
}

function CtaField({
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  inputMode,
  autoComplete,
  maxLength,
}: CtaFieldProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={inputClassName}
      />
    </div>
  )
}

export function CtaHome() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return

    if (!name.trim()) {
      setFeedback({ type: "error", message: "Informe seu nome." })
      return
    }

    if (!isPhoneValid(phone)) {
      setFeedback({
        type: "error",
        message: "Informe um telefone completo: (11) 99999-9999 ou internacional começando com +.",
      })
      return
    }

    if (!email.trim()) {
      setFeedback({ type: "error", message: "Informe seu e-mail." })
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const response = await submitHomeCta({ name, phone, email })
      setFeedback({ type: "success", message: response.message || ctaData.successText })
      setName("")
      setPhone("")
      setEmail("")
    } catch (error) {
      setFeedback({ type: "error", message: getCtaErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formFields = (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <CtaField
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={ctaData.namePlaceholder}
          disabled={isSubmitting}
        />
        <CtaField
          type="tel"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          placeholder={ctaData.phonePlaceholder}
          disabled={isSubmitting}
          inputMode="tel"
          autoComplete="tel"
          maxLength={24}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <CtaField
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={ctaData.placeholder}
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative overflow-hidden whitespace-nowrap rounded-xl bg-[#319600] px-6 py-2.5 text-sm font-bold tracking-wide text-[#FFFFFF] disabled:cursor-not-allowed disabled:opacity-60 sm:shrink-0"
        >
          {isSubmitting ? ctaData.submittingText : ctaData.buttonText}
        </button>
      </div>
    </div>
  )

  const feedbackMessage = feedback && (
    <p
      role="status"
      className={`mt-3 text-center font-mono text-xs ${
        feedback.type === "success" ? "text-[#009739]" : "text-red-600"
      }`}
    >
      {feedback.message}
    </p>
  )

  return (
    <section className="relative py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[#009739] sm:text-4xl md:text-6xl md:leading-[0.9]">
            {ctaData.heading}
          </h2>
        </div>

        <div className="mx-auto mb-8 max-w-xl">
          {formFields}
          {feedbackMessage}
          <p className="mt-2 text-center font-mono text-xs font-bold text-[#009739]/50">{ctaData.smallText}</p>
        </div>

        <div className="mb-10 text-center">
          <p className="mx-auto max-w-xl font-mono text-xs leading-relaxed font-bold text-[#009739]/60">
            {ctaData.paragraph}
          </p>
        </div>
      </form>
    </section>
  )
}
