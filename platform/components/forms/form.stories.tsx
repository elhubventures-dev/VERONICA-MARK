import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

interface DemoValues {
  email: string;
}

function FormDemo() {
  const form = useForm<DemoValues>({ defaultValues: { email: "" } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="max-w-md space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="you@example.com" />
              </FormControl>
              <FormDescription>We'll never share your email with brands without consent.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Form>
  );
}

const meta = {
  title: "Design System/Forms/Form",
  component: FormDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof FormDemo>;

export default meta;
type Story = StoryObj<typeof FormDemo>;

export const Default: Story = {
  render: () => <FormDemo />,
};
