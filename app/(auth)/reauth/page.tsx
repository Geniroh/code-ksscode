import { Button } from "@/components/ui/button";

import Image from "next/image";
import { signIn } from "@/auth";

export default function ReAuthPage() {
  return (
    <div>
      <h1>Additional Permissions Required</h1>
      <p>We need additional permissions to access your Google Calendar.</p>
      <form
        action={async () => {
          "use server";

          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <Button size={"lg"} className="w-full">
          <div className="p-1 bg-white rounded-sm">
            <Image
              src="/icons/google.svg"
              alt="google"
              width={16}
              height={16}
            />
          </div>
          Reconnect Google Account
        </Button>
      </form>
    </div>
  );
}
