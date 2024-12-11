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
import { Input } from "../../ui/input.js";
import { Button } from "../../ui/button.js";
import { CreateFranchiseDTO } from "./types.js";
import { useFranchises } from "../AuctionProvider.js";
import { Franchise } from "./franchise.service.js";
import { useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
  city: z
    .string()
    .min(3, { message: "must be at least 3 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});

type AddFranchiseFormProps = {
  handleAddFranchise: () => void;
};

const AddFranchiseForm = ({ handleAddFranchise }: AddFranchiseFormProps) => {
  const { franchiseService } = useFranchises();
  const [franchise, setFranchise] = useState<Franchise>({
    name: "",
    id: 0,
    teams: [],
    city: "",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: franchise.name,
      city: franchise.city,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newFranchiseDTO: CreateFranchiseDTO = {
      name: values.name,
      city: values.city,
    };

    await franchiseService.addOne(newFranchiseDTO);

    handleAddFranchise();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Franchise</FormLabel>
              <FormControl>
                <Input placeholder="Enter Franchise name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

export default AddFranchiseForm;
