interface DisclaimerProps {
  text: string;
}

export function Disclaimer({ text }: DisclaimerProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <div className="border-t border-[#003B7A]/10 pt-8">
        <p className="text-xs italic leading-relaxed text-[#003B7A]/50">{text}</p>
      </div>
    </div>
  );
}
