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
import { useEffect, useState } from "react";
import { PlayerApplication } from "./application.service.js";
import { usePlayerApplications } from "../../AuctionProvider";
import { CreatePlayerApplicationDTO } from "./types";

// what fields do i need for the application
/* 1. name
      2. round base price
      3. for which auction   
   */

const formSchema = z.object({
  // name: z
  //   .string()
  //   .min(2, { message: "must be at least 2 characters" })
  //   .max(20, { message: "should be less than 20 characters" }),

  // not sure of validation, that's why it is emptied
  auctionId: z.string().refine((value) => value !== "", {
    message: "Auction must be selected..",
  }),
});
type AddEditionProps = {
  handleAddApplication: (application: PlayerApplication) => void;
};

const AddApplicationForm = ({ handleAddApplication }: AddEditionProps) => {
  let { playerApplicationService } = usePlayerApplications();
  // const [auctions, setAuctions] = useState<Auction[]>([]);
  // for the use of auction for the dropdown.
  const [application, setApplication] = useState<PlayerApplication>({
    auctionId: "0",
    id: 0,
    playerId: 0,
    roundBasePrice: {},
    status: "pending",
  });
  // let leagues: League[];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auctionId: "",
      // status: "pending",
    },
  });

  // useEffect(() => {
  //   const fetchLeagues = async () => {
  //     try {
  //       const fetchedAplicaitons = await playerApplicationService.getAll();
  //       setApplication(fetchedLeagues);
  //     } catch (error) {
  //       console.error("Failed to fetch leagues:", error);
  //     }
  //   };

  //   fetchLeagues();
  //   console.log(leagues);
  // }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newPlayerApplicationDTO: CreatePlayerApplicationDTO = {
      auctionId: values.auctionId,
      playerId: 1,
      // hardcoded because of roundbasePrice incomplete invalidation.
      roundBasePrice: {
        1: 10000,
        2: 20000,
        3: 30000,
      },
    };
    console.log(newPlayerApplicationDTO);
    const newPlayerApplication = await playerApplicationService.addOne(
      newPlayerApplicationDTO
    );
    console.log("new Application", newPlayerApplication);
    setApplication(newPlayerApplication);
    handleAddApplication(newPlayerApplication);
    console.log(await playerApplicationService.getAll());
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="auctionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Player Name</FormLabel>
              <FormControl>
                <Input
                  disabled={true}
                  placeholder="Enter Player Name"
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
              <FormLabel className="text-black">Player Details{}</FormLabel>
              <FormControl>
                <Input placeholder="Enter Registration Details" {...field} />
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
              <FormLabel className="text-black">Registration</FormLabel>
              <FormControl>
                <Input placeholder="Enter Registration Details" {...field} />
              </FormControl>
              {/* <FormDescription>form to add a new edition</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

export default AddApplicationForm;
