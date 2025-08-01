import { Button } from "@repo/ui/components/button";
import Link from "next/link";

type Props = {};

export async function Navbar({}: Props) {
  return (
    <div className="h-16 w-full flex items-center justify-between content-container mx-auto">
      <div className="text-white font-black text-2xl font-heading">
        Bloonsoo
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant={"ghost"}
          className="text-white border border-white/20"
        >
          <Link href="/account">List your Property</Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href="/account">My Account</Link>
        </Button>
      </div>
    </div>
  );
}
