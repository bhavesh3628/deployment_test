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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { LeagueCard } from "./addCard";
import { UseFormHandleSubmit } from "react-hook-form";
import { League } from "./league";
import { log } from "console";
const formSchema = z.object({
  league: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});
type AddLeagueProps = {
  handleAddLeague: (league: League) => void;
};

const AddLeagueForm = ({ handleAddLeague }: AddLeagueProps) => {
  const [league, setLeague] = useState<League>({ name: "" });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      league: league.name,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newLeague = { name: values.league };
    setLeague(newLeague);
    handleAddLeague(newLeague);
    console.log(values);
    console.log({ ...form });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="league"
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
