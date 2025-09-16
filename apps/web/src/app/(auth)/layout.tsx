import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-1">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <img
            src="/assets/kidlink2.png"
            alt="Kidlink Logo"
            className="w-32 h-32 object-contain"
          />
          {/* <span className="font-heading text-primary/90">Kidlink.com</span> */}
        </a>
        {children}
      </div>
    </div>
  );
}
