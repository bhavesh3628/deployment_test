import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../ui/input.js";
import { Button } from "../../ui/button.js";
import { useEffect, useState } from "react";
import { League } from "../league/league.service.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateEditionDTO } from "./types.js";
import editionService, { Edition } from "./edition.service.js";
import { useLeagues } from "../AuctionProvider.js";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
  leagueId: z.string().refine((value) => +value > 0, {
    message: "League must be selected..",
  }),
});
type AddEditionProps = {
  handleAddEdition: (edition: Edition) => void;
};

const AddEditionForm = ({ handleAddEdition }: AddEditionProps) => {
  let { leagueService } = useLeagues();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [edition, setEdition] = useState<Edition>({
    name: "",
    id: 0,
    leagueId: 0,
  });
  // let leagues: League[];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: edition.name,
      leagueId: "0",
    },
  });

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const fetchedLeagues = await leagueService.getAll();
        setLeagues(fetchedLeagues);
      } catch (error) {
        console.error("Failed to fetch leagues:", error);
      }
    };

    fetchLeagues();
    console.log(leagues);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newEditionDTO: CreateEditionDTO = {
      name: values.name,
      leagueId: +values.leagueId,
    };
    console.log(newEditionDTO);
    const newEdition = await editionService.addOne(newEditionDTO);
    setEdition(newEdition);
    handleAddEdition(newEdition);
    await leagueService.addEdition(newEdition);
    console.log(await leagueService.getAll());
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <p>Edition</p>
              <FormControl>
                <Input placeholder="Enter edition name" {...field} />
              </FormControl>
              {/* <FormDescription>form to add a new edition</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leagueId"
          render={({ field }) => (
            <FormItem>
              <p>League</p>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select League" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leagues.map((league, key) => (
                    <SelectItem key={key} value={String(league.id)}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage />
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
