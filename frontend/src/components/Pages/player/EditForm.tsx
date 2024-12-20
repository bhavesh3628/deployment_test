import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../../ui/input.js";
import { Button } from "../../ui/button.js";
import playerService, { Player } from "./player.service.js";
import { EditPlayerDTO } from "./types.js";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
  dob: z
    .string()
    .min(6, { message: "must be at least 10 characters" })
    .max(30, { message: "should be less than 30 characters" }),
  nationality: z
    .string()
    .min(4, { message: "must be at least 4 characters" })
    .max(20, { message: "should be less than 20 characters" }),
  specialization: z.string().refine((value) => value !== "", {
    message: "Skills must be selected..",
  }),
});
type EditPlayerProps = {
  handleEditPlayer: (id: string, editedPlayer: EditPlayerDTO) => void;
  currentPlayer: Player;
};

const EditPlayerForm = ({
  handleEditPlayer,
  currentPlayer,
}: EditPlayerProps) => {
  const skills = ["Batter", "Bowler", "All Rounder", "Wicketkeeper"];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentPlayer.name,
      dob: currentPlayer.dob,
      nationality: currentPlayer.nationality,
      specialization: currentPlayer.specialization,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ currentPlayer, values });
    const ediPlayertDTO: EditPlayerDTO = {
      name: values.name,
      dob: values.dob,
      nationality: values.nationality,
      specialization: values.specialization,
    };
    const editedPlayer = await playerService.editOne(
      currentPlayer.id,
      ediPlayertDTO
    );
    handleEditPlayer(currentPlayer.id, editedPlayer);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={"Please enter updated player name"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth(DD/MM/YY)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={"Please enter updated player dob"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={"Please enter updated player nationality"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {skills.map((skill, key) => (
                    <SelectItem key={key} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Edit</Button>
      </form>
    </Form>
  );
};

export default EditPlayerForm;
