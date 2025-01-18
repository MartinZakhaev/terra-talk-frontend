import { AppSidebar } from "@/components/navigations/appSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/sign-in");
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "350px",
                } as React.CSSProperties
            }
        >
            <AppSidebar
                user={{
                    id: data.user.id,
                    name: data.user.user_metadata.username,
                    email: data.user.email || "",
                    avatar: data.user.user_metadata.avatar,
                }}
            />
            {children}
        </SidebarProvider>
    );
}