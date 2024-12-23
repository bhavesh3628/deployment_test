import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useState } from "react";
import { PlayerApplication } from "./application.service.js";
import { usePlayerApplications } from "../../AuctionProvider";
import { CreatePlayerApplicationDTO } from "./types";
import { Player } from "../../player/player.service.js";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog.js";

// what fields do i need for the application
/* 1. name
      2. round base price
      3. for which auction   
   */

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "must be at least 2 characters" })
    .max(20, { message: "should be less than 20 characters" }),

  // not sure of validation, that's why it is emptied
  playerId: z.string().refine((value) => value !== "", {
    message: "Form must be registered for player",
  }),

  dob: z
    .string()
    .refine((value) => value !== "", { message: "DOB must be entered" }),

  nationality: z
    .string()
    .refine((value) => value !== "", { message: "Country must be specified" }),

  specialization: z.string().refine((value) => value !== "", {
    message: "Skill is important for registration",
  }),
  auctionId: z.string().refine((value) => value !== "", {
    message: "Auction must be selected",
  }),
});
type AddApplicationProps = {
  player: Player;
};

const AddApplicationForm = ({ player }: AddApplicationProps) => {
  let { playerApplicationService } = usePlayerApplications();
  // const [auctions, setAuctions] = useState<Auction[]>([]);
  // for the use of auction for the dropdown.
  // let leagues: League[];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auctionId: "",
      playerId: player.id,
      dob: player.dob,
      name: player.name,
      nationality: player.nationality,
      specialization: player.specialization,
    },
  });

  // useEffect(() => {
  //   const fetchAuctions = async () => {
  //     try {
  //       const fetchedAuctions = await auctionService.getAll();
  //       setAuctions(fetchedAuctions);
  //     } catch (error) {
  //       console.error("Failed to fetch Auctions:", error);
  //     }
  //   };

  //   fetchAuctions();
  //   console.log(auctions);
  // }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newPlayerApplicationDTO: CreatePlayerApplicationDTO = {
      auctionId: values.auctionId,
      playerId: values.playerId,
      // hardcoded because of roundbasePrice incomplete invalidation.
      roundBasePrice: {},
    };
    console.log(newPlayerApplicationDTO);
    const newPlayerApplication = await playerApplicationService.addOne(
      newPlayerApplicationDTO
    );
    console.log("new Application", newPlayerApplication);
    // handleAddApplication(newPlayerApplication);
    console.log(await playerApplicationService.getAll());
  }

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mb-5 pb-2">
        Player Registration Form
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="Enter Player Name"
                      {...field}
                      // value={player.name}
                    />
                  </FormControl>
                  {/* <FormDescription>form to add a new edition</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={player.dob ? true : false}
                      placeholder="Enter Date of Birth"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>form to add a new edition</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Specialization</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="Enter Player Specialization"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>form to add a new edition</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black"> Nationality</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    placeholder="Enter Nationality"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>form to add a new edition</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auctionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  Select auction for registration
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Registration Details" {...field} />
                </FormControl>
                {/* <FormDescription>form to add a new edition</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* For auction there should be a drop down menu */}
          {/* 
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
          </Select> */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <p>Round BasePrice</p>
                <FormControl>
                  <Input placeholder="Enter Registration Details" {...field} />
                </FormControl>
                {/* <FormDescription>form to add a new edition</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button
              onClick={async () => {
                await onSubmit;
              }}
            >
              Submit Application
            </Button>
          </div>

          {/* <Button type="submit">Add</Button> */}
        </form>
      </Form>
    </div>
  );
};

export default AddApplicationForm;
