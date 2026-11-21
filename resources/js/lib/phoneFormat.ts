const MAX_BR_DIGITS = 11
const MAX_INTERNATIONAL_DIGITS = 15

const TWO_DIGIT_COUNTRY_CODES = [
  "44", "49", "33", "39", "34", "41", "43", "61", "81", "86", "91",
  "52", "54", "56", "57", "58", "48", "31", "32", "46", "47", "45",
  "30", "36", "40", "64", "27", "63", "66", "84", "62", "60", "65",
]

const THREE_DIGIT_COUNTRY_CODES = ["351", "353", "358", "420", "421", "595", "598"]

function formatBrazilLocal(digits: string): string {
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)

  if (rest.length <= 4) {
    return `(${ddd}) ${rest}`
  }

  const isMobile = rest[0] === "9" || rest.length > 8

  if (isMobile) {
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`
  }

  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`
}

function splitCountryCode(digits: string): { countryCode: string; national: string } {
  if (digits.startsWith("1")) {
    return { countryCode: "1", national: digits.slice(1) }
  }

  for (const code of THREE_DIGIT_COUNTRY_CODES) {
    if (digits.startsWith(code)) {
      return { countryCode: code, national: digits.slice(code.length) }
    }
  }

  for (const code of TWO_DIGIT_COUNTRY_CODES) {
    if (digits.startsWith(code)) {
      return { countryCode: code, national: digits.slice(code.length) }
    }
  }

  if (digits.length <= 3) {
    return { countryCode: digits, national: "" }
  }

  return { countryCode: digits.slice(0, 2), national: digits.slice(2) }
}

function groupNationalNumber(national: string): string {
  if (!national) return ""

  const parts: string[] = []
  let index = 0

  while (index < national.length) {
    const remaining = national.length - index

    if (remaining <= 4) {
      parts.push(national.slice(index))
      break
    }

    parts.push(national.slice(index, index + 3))
    index += 3
  }

  return parts.join(" ")
}

function formatInternational(value: string): string {
  const digits = value.replace(/[^\d+]/g, "")
  const normalized = digits.startsWith("+") ? digits : `+${digits.replace(/\+/g, "")}`
  const nums = normalized.slice(1).slice(0, MAX_INTERNATIONAL_DIGITS)

  if (nums.length === 0) return "+"

  if (nums.startsWith("55")) {
    const local = formatBrazilLocal(nums.slice(2))
    return local ? `+55 ${local}` : "+55"
  }

  const { countryCode, national } = splitCountryCode(nums)
  const grouped = groupNationalNumber(national)

  return grouped ? `+${countryCode} ${grouped}` : `+${countryCode}`
}

export function formatPhoneInput(value: string): string {
  const trimmed = value.trimStart()

  if (trimmed.startsWith("+") || value === "+") {
    return formatInternational(value)
  }

  const digits = value.replace(/\D/g, "").slice(0, MAX_BR_DIGITS)
  return formatBrazilLocal(digits)
}

/** Formata um número vindo da API para exibição (BR ou internacional). */
export function formatPhoneDisplay(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""

  if (trimmed.startsWith("+")) {
    return formatInternational(trimmed)
  }

  const digits = trimmed.replace(/\D/g, "")
  if (!digits) return trimmed

  if (digits.startsWith("55") && digits.length > 11) {
    const local = formatBrazilLocal(digits.slice(2))
    return local ? `+55 ${local}` : trimmed
  }

  if (digits.length > 11) {
    return formatInternational(`+${digits}`)
  }

  return formatBrazilLocal(digits) || trimmed
}

export function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "")
}

export function getPhoneDigitCount(phone: string): number {
  return phone.replace(/\D/g, "").length
}

export function isPhoneValid(phone: string): boolean {
  const digits = getPhoneDigitCount(phone)

  if (phone.trimStart().startsWith("+")) {
    return digits >= 8 && digits <= MAX_INTERNATIONAL_DIGITS
  }

  return digits >= 10 && digits <= MAX_BR_DIGITS
}
