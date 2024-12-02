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
import leagueService, { League } from "./league.service";
import { CreateLeagueDTO } from "./types.js";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});
type AddLeagueProps = {
  handleAddLeague: () => void;
};

const AddLeagueForm = ({ handleAddLeague }: AddLeagueProps) => {
  const [league, setLeague] = useState<League>({
    name: "",
    id: 0,
    editions: [],
    createdAt: "",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: league.name,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newLeagueDTO: CreateLeagueDTO = {
      name: values.name,
    };

    const newLeague = await leagueService.addOne(newLeagueDTO);
    setLeague(newLeague);
    handleAddLeague();
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
