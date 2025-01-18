import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NewConversationSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toastError, toastSuccess } from "@/utils/toast";
import { useConversationStore } from "@/stores/useConversationStore";

interface NewConversationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

export function NewConversationDialog({ isOpen, onOpenChange, userId }: NewConversationDialogProps) {
    const form = useForm({
        resolver: zodResolver(NewConversationSchema),
        defaultValues: {
            email: "",
        },
    });
    const { addConversation } = useConversationStore();

    async function onSubmit(values: any) {
        try {
            const response = await axios.post("http://localhost:7777/api/conversations", {
                inviterId: userId,
                inviteeEmail: values.email,
            });

            addConversation(response.data);
            onOpenChange(false);
            form.reset();
            toastSuccess("Conversation created successfully!");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                form.reset();
                toastError("User not found with this email address");
            } else {
                form.reset();
                toastError("Failed to create conversation");
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                    <DialogDescription>
                        Start a new conversation with other users.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email *</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="email@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}