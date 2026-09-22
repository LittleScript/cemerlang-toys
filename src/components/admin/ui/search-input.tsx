"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
} & (
  | {
      mode?: "server";
      name?: string;
      action?: string;
      onSearch?: undefined;
    }
  | {
      mode: "client";
      onSearch: (q: string) => void;
      name?: undefined;
      action?: undefined;
    }
);

type ServerSearchProps = {
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  action?: string;
  className?: string;
};

type ClientSearchProps = {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  className?: string;
};

export function SearchInput(props: SearchInputProps) {
  const { placeholder = "Cari...", defaultValue = "", className } = props;
  if (props.mode === "client") {
    return (
      <ClientSearch
        {...{ placeholder, defaultValue, onSearch: props.onSearch, className }}
      />
    );
  }
  return (
    <ServerSearch
      {...{
        placeholder,
        defaultValue,
        name: props.name,
        action: props.action,
        className,
      }}
    />
  );
}

function ServerSearch({
  placeholder,
  defaultValue,
  name = "q",
  action,
  className,
}: ServerSearchProps) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={action}
      method="get"
      className={cn("relative", className)}
    >
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />
      <input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:outline-none transition-colors"
      />
      {defaultValue && (
        <button
          type="button"
          onClick={() => {
            const inp = formRef.current?.querySelector(
              "input"
            ) as HTMLInputElement;
            if (inp) {
              inp.value = "";
              formRef.current?.requestSubmit();
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Hapus pencarian"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}

function ClientSearch({
  placeholder,
  defaultValue,
  onSearch,
  className,
}: ClientSearchProps) {
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const debounced = useCallback(
    (q: string) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearch(q), 300);
    },
    [onSearch]
  );

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={`${placeholder} (Ctrl+K)`}
        onChange={(e) => {
          setValue(e.target.value);
          debounced(e.target.value);
        }}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Hapus"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
