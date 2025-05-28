import React from "react";

type Props = {
  className?: string;
};

export function Logo({ className }: Props) {
  return (
    <h1
      className={`font-heading font-black tracking-tight text-foreground ${className}`}
    >
      CodeVille
    </h1>
  );
}
