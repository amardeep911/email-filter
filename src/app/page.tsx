import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <Button>
        <Link href="/api/auth/google">Sign in with google</Link>
      </Button>
    </div>
  );
}
