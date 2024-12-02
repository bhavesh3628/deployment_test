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
import { Edition } from "./Edition";
import { League } from "../league/league.service.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateEditionDTO } from "./types.js";
import editionService from "./edition.service.js";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
  leagueId: z.string(),
});
type AddEditionProps = {
  leagues: League[];
  handleAddEdition: (edition: Edition) => void;
};

const AddEditionForm = ({ handleAddEdition, leagues }: AddEditionProps) => {
  const [edition, setEdition] = useState<Edition>({
    name: "",
    id: 0,
    leagueId: 0,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: edition.name,
      leagueId: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newEditionDTO: CreateEditionDTO = {
      name: values.name,
      leagueId: +values.leagueId,
    };

    const newEdition = await editionService.addOne(newEditionDTO);
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
        <FormField
          control={form.control}
          name="leagueId"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leagues.map((league) => (
                    <SelectItem value={String(league.id)}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

export default AddEditionForm;
