import type { ModuleEntry, Pill } from "../config/modules";

export type { ModuleEntry, Pill };

export type ModuleRowProps = {
  entry: ModuleEntry;
  isActive: boolean;
  activePillId: string | null;
  onActivate: () => void;
  onPill: (pill: Pill) => void;
};

export default function ModuleRow({
  entry,
  isActive,
  activePillId,
  onActivate,
  onPill,
}: ModuleRowProps) {
  const hasPills = Boolean(entry.pills?.length);

  return (
    <article
      className={[
        "relative overflow-hidden rounded-2xl bg-theme-cardbg p-3 shadow-[0_16px_36px_-26px_rgba(16,40,36,0.55)] transition duration-200 dark:bg-themedark-cardbg dark:shadow-none sm:p-4",
        isActive
          ? "ring-2 ring-[#14967f] ring-offset-2 ring-offset-theme-bodybg dark:ring-offset-themedark-bodybg"
          : "hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(16,40,36,0.4)]",
      ].join(" ")}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <span
        className={[
          "absolute inset-y-0 left-0 w-1",
          isActive ? "bg-[#e8a54b]" : "bg-[#14967f]/35",
        ].join(" ")}
        aria-hidden
      />
      <div className="flex gap-3 sm:gap-3.5">
        <div
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11",
            isActive
              ? "bg-[#14967f] text-white shadow-[0_8px_16px_-10px_rgba(13,122,104,0.9)]"
              : "bg-[#14967f]/12 text-[#0d7a68] dark:bg-[#14967f]/20 dark:text-[#7ddec8]",
          ].join(" ")}
        >
          <i className={`${entry.icon} text-[0.95rem] sm:text-base`} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold leading-snug text-theme-headings dark:text-themedark-headings sm:text-[0.9375rem]">
            {entry.title}
          </h2>
          {hasPills ? (
            <div
              className="mt-2 flex flex-wrap gap-1.5"
              role="group"
              aria-label={`${entry.title} actions`}
            >
              {entry.pills!.map((pill) => {
                const pillOn = isActive && activePillId === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => onPill(pill)}
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight transition sm:text-[11px]",
                      "border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14967f]",
                      pillOn
                        ? "border-[#14967f] bg-[#14967f] text-white"
                        : "border-theme-border bg-[#14967f]/5 text-theme-bodycolor hover:border-[#14967f]/50 hover:bg-[#14967f]/12 dark:border-themedark-border dark:text-themedark-bodycolor dark:hover:border-[#14967f]/50",
                    ].join(" ")}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
