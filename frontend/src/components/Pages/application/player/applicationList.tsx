import { useEffect, useState } from "react";
import { usePlayerApplications } from "../../AuctionProvider";
import { PlayerApplication } from "./application.service";
import ApplicationCard from "./ApplicationCard";

const PlayerApplicationList = () => {
  const { playerApplicationService } = usePlayerApplications();
  const [applications, setApplications] = useState<PlayerApplication[]>([]);

  // to fetch applications at the beginning
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const fetchedApplications: PlayerApplication[] =
          await playerApplicationService.getAll();
        setApplications(fetchedApplications);
      } catch (error) {
        if (error) console.log("error in fetching playr applications: ", error);
      }
    };
    fetchApplications();
    console.log(applications);
  }, []);
  return (
    <div className="w-full m-4">
      <h1 className="text-xl font-bold">Player Application Management</h1>

      <div className="mt-5 flex flex-row flex-wrap items-center gap-4">
        {applications.length > 0 ? (
          <>
            {applications.map((application) => (
              <ApplicationCard playerApplication={application} />
            ))}
          </>
        ) : (
          <p className="text-lg">No applications yet for any auction</p>
        )}
      </div>
    </div>
  );
};

export default PlayerApplicationList;
