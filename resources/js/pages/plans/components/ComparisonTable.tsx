import { Check, X } from "lucide-react";
import { PlanCtaButton } from "@/pages/plans/components/PlanCtaButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/pages/ui/table";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { planColumnShortLabel } from "@/pages/plans/lib/planDisplay";
import type { Plan } from "@/pages/plans/types";

type CellValue = boolean | string;

interface ComparisonRow {
  label: string;
  p1: CellValue;
  p2: CellValue;
  p3: CellValue;
}

interface ComparisonTableProps {
  title: string;
  description: string;
  rows: ComparisonRow[];
  plans: Plan[];
}

const renderCellContent = (value: CellValue) => {
  if (typeof value === "boolean") {
    return value
      ? <Check className="mx-auto h-4 w-4 text-[#009739] md:h-5 md:w-5" />
      : <X className="mx-auto h-3.5 w-3.5 text-[#003B7A]/20 md:h-4 md:w-4" />;
  }
  return <span className="text-xs font-semibold md:text-sm">{value}</span>;
};

export function ComparisonTable({ title, description, rows, plans }: ComparisonTableProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <PremiumSectionHeader title={title} description={description} className="text-center" />

      <div className="overflow-x-auto rounded-[1.75rem] border-2 border-[#003B7A]/12 bg-white/90 shadow-[0_16px_50px_-20px_rgba(0,59,122,0.25)] backdrop-blur-sm">
        <Table className="w-full min-w-[640px] table-fixed">
          <TableHeader>
            <TableRow className="bg-[#003B7A]/5 hover:bg-[#003B7A]/5">
              <TableHead className="px-4 py-5 text-xs font-bold text-[#003B7A] md:px-6 md:text-sm">
                Funcionalidade
              </TableHead>
              {plans.map((plan) => (
                <TableHead
                  key={plan.name}
                  className={`w-[19%] px-1 text-center text-xs font-bold md:px-4 md:text-sm ${
                    plan.popular
                      ? "bg-[#009739]/8 font-black text-[#009739]"
                      : "text-[#003B7A]"
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
              <TableRow key={i} className="border-b border-[#003B7A]/8">
                <TableCell className="px-4 py-4 text-xs font-bold leading-snug text-[#003B7A]/65 md:px-6 md:text-sm">
                  {row.label}
                </TableCell>
                <TableCell
                  className={`px-1 text-center md:px-4 ${
                    plans[0]?.popular ? "bg-[#009739]/5" : ""
                  }`}
                >
                  {renderCellContent(row.p1)}
                </TableCell>
                <TableCell
                  className={`px-1 text-center font-bold md:px-4 ${
                    plans[1]?.popular ? "bg-[#009739]/5" : ""
                  }`}
                >
                  {renderCellContent(row.p2)}
                </TableCell>
                <TableCell
                  className={`px-4 text-center md:px-6 ${
                    plans[2]?.popular ? "bg-[#009739]/5" : ""
                  }`}
                >
                  {renderCellContent(row.p3)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-none hover:bg-transparent">
              <TableCell className="px-4 py-6 md:px-6" />
              {plans.map((plan) => (
                <TableCell
                  key={plan.name}
                  className={`px-2 py-6 text-center align-bottom md:px-4 ${
                    plan.popular ? "border-x border-[#009739]/15 bg-[#009739]/5" : ""
                  }`}
                >
                  <PlanCtaButton
                    href={plan.href}
                    className={`mx-auto inline-flex w-full max-w-[110px] transform items-center justify-center gap-1 whitespace-normal rounded-xl px-3 py-2 text-[10px] font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:max-w-none sm:gap-2 sm:whitespace-nowrap sm:px-6 sm:py-4 sm:text-xs md:px-8 md:py-5 md:text-sm ${
                      plan.popular
                        ? "bg-[#009739] text-white shadow-lg hover:scale-105 hover:bg-[#00b344]"
                        : "border-[#003B7A] bg-[#003B7A] text-white hover:bg-white hover:text-black"
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
  );
}
