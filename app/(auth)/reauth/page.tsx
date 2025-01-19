import { signIn } from "next-auth/react";

export default function ReAuthPage() {
  return (
    <div>
      <h1>Additional Permissions Required</h1>
      <p>We need additional permissions to access your Google Calendar.</p>
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
            scope:
              "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
          })
        }
      >
        Reconnect Google Account
      </button>
    </div>
  );
}
