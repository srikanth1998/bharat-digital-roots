import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { searchMembers } from "@/lib/forum.functions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Member = { id: string; user_id: string; full_name: string; email: string; member_code: string };

export function MemberPicker({
  value,
  onChange,
  placeholder = "Search members by name, email, or ID…",
}: {
  value: string | null;
  onChange: (userId: string | null, member: Member | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const search = useServerFn(searchMembers);
  const q = useQuery({
    queryKey: ["member-search", query],
    queryFn: () => search({ data: { query } }),
    enabled: open,
  });
  const selected = (q.data ?? []).find((m) => m.user_id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between gap-2 border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white text-left",
            !selected && "text-brand-ink/50",
          )}
        >
          <span className="truncate flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-brand-ink/40 shrink-0" />
            {selected ? `${selected.full_name} · ${selected.member_code}` : placeholder}
          </span>
          <ChevronsUpDown className="w-3.5 h-3.5 text-brand-ink/40 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Type a name, email, or FFM-…" value={query} onValueChange={setQuery} />
          <CommandList>
            {q.isLoading && <div className="px-3 py-4 text-xs text-brand-ink/60">Searching…</div>}
            {!q.isLoading && (q.data ?? []).length === 0 && <CommandEmpty>No approved members found.</CommandEmpty>}
            <CommandGroup>
              {(q.data ?? []).map((m) => (
                <CommandItem
                  key={m.id}
                  value={m.user_id}
                  onSelect={() => {
                    onChange(m.user_id, m);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === m.user_id ? "opacity-100" : "opacity-0")} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{m.full_name}</p>
                    <p className="truncate text-xs text-brand-ink/50">
                      {m.member_code} · {m.email}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
