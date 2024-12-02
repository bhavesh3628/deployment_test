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
import { useEffect, useState } from "react";
import leagueService, { League } from "./league.service";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});
type EditLeagueProps = {
  handleEditLeague: (id: number, editedName: string) => void;
  currentLeague: League;
};

const EditLeagueForm = ({
  handleEditLeague,
  currentLeague,
}: EditLeagueProps) => {
  // const [editedLeague, setEditedLeague] = useState<League>({
  //   name: "",
  //   id: 0,
  //   editions: [],
  //   createdAt: "",
  // });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentLeague.name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ currentLeague, values });
    const editedLeague = await leagueService.editOne(
      currentLeague.id,
      values.name
    );
    // console.log(editedLeague);
    handleEditLeague(currentLeague.id, editedLeague.name);
    //  setEditedLeague();
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
                {/* placeholder is used to indicate user what will be the value or example */}
                <Input
                  {...field}
                  placeholder={"Please Enter Edited League Name"}
                  // value={currentLeague.name}
                />
              </FormControl>
              <FormDescription>form to add a new league</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Edit</Button>
      </form>
    </Form>
  );
};

export default EditLeagueForm;
