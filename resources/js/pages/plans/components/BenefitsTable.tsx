import { Check, X } from "lucide-react";
import { PlanCtaButton } from "@/pages/plans/components/PlanCtaButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/pages/ui/table";
import { planColumnShortLabel } from "@/pages/plans/lib/planDisplay";
import type { Plan } from "@/pages/plans/types";

type CellValue = boolean | string;

interface BenefitRow {
  label: string;
  p1: CellValue;
  p2: CellValue;
  p3: CellValue;
}

interface BenefitsTableProps {
  title: string;
  description: string;
  rows: BenefitRow[];
  plans: Plan[];
}

const renderCellContent = (value: CellValue) => {
  if (typeof value === "boolean") {
    return value
      ? <Check className="h-4 w-4 md:h-5 md:w-5 mx-auto text-secondary" />
      : <X className="h-3.5 w-3.5 md:h-4 md:w-4 mx-auto text-muted-foreground/30" />;
  }
  return <span className="text-xs md:text-sm font-semibold">{value}</span>;
};

export function BenefitsTable({ title, description, rows, plans }: BenefitsTableProps) {
  return (
    <section className="relative overflow-hidden bg-[#003B7A] px-4 py-14 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "4rem 100%",
        }}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            Benefícios exclusivos
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">{title}</h2>
          <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#AFFF00]/70 to-transparent" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">{description}</p>
        </div>
        <div className="overflow-x-auto rounded-[1.75rem] border border-white/15 bg-white/97 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <Table className="w-full min-w-[640px] table-fixed">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold py-5 px-4 md:px-6 text-xs md:text-sm text-gray-900">Funcionalidade</TableHead>
                {plans.map((plan) => (
                  <TableHead
                    key={plan.name}
                    className={`text-center font-bold w-[19%] text-xs md:text-sm px-1 md:px-4 ${
                      plan.popular
                        ? "font-black text-secondary bg-primary/5"
                        : "text-gray-900"
                    }`}
                  >
                    <span className="hidden sm:inline">Plataforma </span>
                    {planColumnShortLabel(plan)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} className="border-b border-gray-200">
                  <TableCell className="font-bold text-gray-600 py-4 px-4 md:px-6 text-xs md:text-sm leading-snug">
                    {row.label}
                  </TableCell>
                  <TableCell
                    className={`text-center px-1 md:px-4 ${
                      plans[0]?.popular ? "bg-primary/5" : ""
                    }`}
                  >
                    {renderCellContent(row.p1)}
                  </TableCell>
                  <TableCell
                    className={`text-center font-bold px-1 md:px-4 ${
                      plans[1]?.popular ? "bg-primary/5" : ""
                    }`}
                  >
                    {renderCellContent(row.p2)}
                  </TableCell>
                  <TableCell
                    className={`text-center px-4 md:px-6 ${
                      plans[2]?.popular ? "bg-primary/5" : ""
                    }`}
                  >
                    {renderCellContent(row.p3)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-none hover:bg-transparent">
                <TableCell className="py-6 px-4 md:px-6" />
              {plans.map((plan) => (
                <TableCell
                  key={plan.name}
                  className={`text-center py-6 px-2 md:px-4 align-bottom ${
                    plan.popular ? "bg-primary/5 border-x border-primary/10" : ""
                  }`}
                >
                  <PlanCtaButton
                    href={plan.href}
                    className={`inline-flex items-center justify-center gap-1 sm:gap-2 font-semibold px-3 py-2 sm:px-6 sm:py-3.5 rounded-xl text-[10px] sm:text-xs md:text-sm shadow-lg hover:shadow-xl transition-colors w-full max-w-[110px] sm:max-w-none mx-auto whitespace-normal sm:whitespace-nowrap ${
                      plan.popular
                        ? "bg-secondary text-white hover:bg-[#00802f]"
                        : "bg-[#003B7A] text-white hover:bg-[#002B5A]"
                    }`}
                  >
                    {plan.ctaText}
                  </PlanCtaButton>
                </TableCell>
              ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
