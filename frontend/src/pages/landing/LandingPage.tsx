import { useOutletContext, useParams } from "react-router-dom";
import LandingProject from "../../components/landing/project/LandingProject";
import LandingSprint from "../../components/landing/sprint/LandingSprint";
import LandingMember from "../../components/landing/member/LandingMember";
import LandingLink from "../../components/landing/link/LandingLink";
import { Socket } from "socket.io-client";
import useLandingSocket from "../../hooks/common/socket/useLandingSocket";
import LandingMemoList from "../../components/landing/memo/LandingMemoList";

const LandingPage = () => {
  const { projectId } = useParams();
  if (!projectId) {
    throw Error("Invalid Web URL");
  }

  const { socket }: { socket: Socket } = useOutletContext();
  const { project } = useLandingSocket(socket);

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="h-[17.6875rem] w-full shrink-0 flex gap-9">
        <LandingProject {...{ projectId }} />
        <LandingMemoList />
      </div>
      <div className="h-[20.5625rem] w-full shrink-0 flex gap-9">
        <LandingSprint />
        <LandingMember projectTitle={project.title} />
        <LandingLink />
      </div>
    </div>
  );
};

export default LandingPage;
