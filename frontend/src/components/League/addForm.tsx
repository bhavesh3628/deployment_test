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
const formSchema = z.object({
  league: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});
type AddLeagueProps = {
  handleAddLeague: (league: string) => void;
};

const AddLeagueForm = (/*{ handleAddLeague }: AddLeagueProps*/) => {
  //   const [league, setLeague] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      league: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    //setLeague(values.league);
    //handleAddLeague(values.league);
    console.log(values);
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
                {/* <LeagueCard league={league} /> */}
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
