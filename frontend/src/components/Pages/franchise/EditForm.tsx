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
import { Franchise } from "./franchise.service.js";
import { useFranchises } from "../AuctionProvider.js";

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
type EditFranchiseProps = {
  handleEditFranchise: () => void;
  currentFranchise: Franchise;
};

const EditFranchiseForm = ({
  handleEditFranchise,
  currentFranchise,
}: EditFranchiseProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentFranchise.name,
      city: currentFranchise.city,
    },
  });

  const { franchiseService } = useFranchises();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ currentFranchise, values });
    await franchiseService.editOne(currentFranchise.id, values);
    handleEditFranchise();
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
                {/* placeholder is used to indicate user what will be the value or example */}
                <Input
                  {...field}
                  placeholder={"Please Enter Edited Franchise Name"}
                />
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
              <FormLabel>Franchise City</FormLabel>
              <FormControl>
                {/* placeholder is used to indicate user what will be the value or example */}
                <Input
                  {...field}
                  placeholder={"Please Enter Edited Franchise City Name"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Edit</Button>
      </form>
    </Form>
  );
};

export default EditFranchiseForm;
