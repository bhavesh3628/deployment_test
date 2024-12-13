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
import editionService, { Edition } from "./edition.service";
import { UpdateEditionDTO } from "./types.js";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),
});
type EditEditionProps = {
  handleEditEdition: (id: number, editedName: string) => void;
  currentEdition: Edition;
};

const EditEditionForm = ({
  handleEditEdition,
  currentEdition,
}: EditEditionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentEdition.name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ currentEdition, values });
    const editDto: UpdateEditionDTO = { name: values.name };
    const editedEdition = await editionService.editOne(
      currentEdition.id,
      editDto
    );
    handleEditEdition(currentEdition.id, editedEdition.name);
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
                {/* placeholder is used to indicate user what will be the value or example */}
                <Input
                  {...field}
                  placeholder={"Please Enter Edited Edition Name"}
                  // value={currentLeague.name}
                />
              </FormControl>
              <FormDescription>form to add a new edition</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Edit</Button>
      </form>
    </Form>
  );
};

export default EditEditionForm;
