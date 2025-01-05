import { redirect } from "next/navigation";
import { signout } from "@/lib/actions/auth.action";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <Button onClick={signout}>Logout</Button>
    </div>
  );
}
