import { signOut } from "@/lib/auth";

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/login",
        });
      }}
    >
      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </form>
  );
}