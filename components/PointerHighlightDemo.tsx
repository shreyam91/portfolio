// PointerHighlightDemo.tsx
import { PointerHighlight } from "@/components/ui/pointer-highlight";

export function PointerHighlightDemo({ text }: { text: string }) {
  return (
    <div className="mx-auto max-w-lg py-20 text-2xl font-bold tracking-tight md:text-4xl">
      The best way to grow is to{" "}
      <PointerHighlight>
        <span>{text}</span>
      </PointerHighlight>
    </div>
  );
}
