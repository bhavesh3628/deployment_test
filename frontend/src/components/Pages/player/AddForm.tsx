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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Input } from "../../ui/input.js";
import { Button } from "../../ui/button.js";
import { CreatePlayerDTO } from "./types.js";
import { usePlayers } from "../AuctionProvider.js";
import { Player } from "./player.service.js";
import { useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
  dob: z
    .string()
    .min(6, { message: "must be at least 10 characters"})
    .max(30, { message: "should be less than 30 characters"}),
  nationality: z
    .string()
    .min(4, { message: "must be at least 4 characters" })
    .max(20, { message: "should be less than 20 characters" }),
  specialization: z.string().refine((value) => value !== '', {
        message: "Skills must be selected..",
    }),
});

type AddPlayerFormProps = {
  handleAddPlayer: () => void;
};

const AddPlayerForm = ({ handleAddPlayer }: AddPlayerFormProps) => {
  const { playerService } = usePlayers();
  const skills = ['Batter', 'Bowler', 'All Rounder', 'Wicketkeeper']
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dob: "",
      nationality: "",
      specialization: ""
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newPlayerDTO: CreatePlayerDTO = {
      name: values.name,
      dob: values.dob,
      nationality: values.nationality,
      specialization: values.specialization
    };

    await playerService.addOne(newPlayerDTO);
    handleAddPlayer();
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <p>Player</p>
              <FormControl>
                <Input placeholder="Enter player name" {...field} />
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
              <p>Date of Birth(DD/MM/YY)</p>
              <FormControl>
                <Input placeholder="Enter data of birth" {...field} />
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
              <p>Nationality</p>
              <FormControl>
                <Input placeholder="Enter nationality" {...field} />
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
              <p>Specialization</p>
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

export default AddPlayerForm;