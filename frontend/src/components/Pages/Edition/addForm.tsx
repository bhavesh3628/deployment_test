import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../ui/input.js";
import { Button } from "../../ui/button.js";
import { useState } from "react";
import { Edition } from "./edition.tsx";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});
type AddEditionProps = {
  handleAddEdition: (edition: Edition) => void;
};

const AddEditionForm = ({ handleAddEdition }: AddEditionProps) => {
  const [edition, setEdition] = useState<Edition>({
    name: "",
    id: 0,
    leagueId: 0,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: edition.name,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEdition = { name: values.name, id: 1, leagueId: 1 };
    setEdition(newEdition);
    handleAddEdition(newEdition);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edition</FormLabel>
              <FormControl>
                <Input placeholder="enter edition name" {...field} />
              </FormControl>
              <FormDescription>form to add a new edition</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

export default AddEditionForm;
