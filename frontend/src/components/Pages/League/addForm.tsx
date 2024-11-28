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
import { LeagueCard } from "./addCard.js";
import { UseFormHandleSubmit } from "react-hook-form";
import { League } from "./league.js";
import { log } from "console";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});
type AddLeagueProps = {
  handleAddLeague: (league: League) => void;
};

const AddLeagueForm = ({ handleAddLeague }: AddLeagueProps) => {
  const [count, setCount] = useState(0);
  const [league, setLeague] = useState<League>({
    name: "",
    id: 0,
    createdAt: "",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: league.name,
    },
  });
  setCount(count + 1);
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newLeague: League = {
      name: values.name,
      id: count,
      createdAt: Date(),
    };
    setLeague(newLeague);
    handleAddLeague(newLeague);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>League</FormLabel>
              <FormControl>
                <Input placeholder="enter league name" {...field} />
              </FormControl>
              <FormDescription>form to add a new league</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

export default AddLeagueForm;
