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
import { CreateLeagueDTO } from "./types.js";
import { useLeagues } from "../AuctionProvider.js";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});

type AddLeagueFormProps = {
  handleAddLeague: () => void;
};

const AddLeagueForm = ({ handleAddLeague }: AddLeagueFormProps) => {
  const { leagueService } = useLeagues();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newLeagueDTO: CreateLeagueDTO = {
      name: values.name,
    };

    await leagueService?.addOne(newLeagueDTO);
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
