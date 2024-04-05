import { useState } from "react";
import { LandingDTO, LandingLinkDTO } from "../../types/DTO/landingDTO";
import { useParams } from "react-router-dom";
import LandingProject from "../../components/landing/LandingProject";
import LandingSprint from "../../components/landing/LandingSprint";
import LandingMember from "../../components/landing/LandingMember";
import Plus from "../../assets/icons/plus.svg?react";
import LandingLinkBlock from "../../components/landing/LandingLinkBlock";

const sampleData: LandingDTO = {
  project: {
    title: "프로젝트 이름",
    subject: "프로젝트 주제가 여기에 이쁘게 쓰여질 예정입니다.",
    createdAt: "2024-03-14T12:00:00Z", // 날짜는 ISOstring 형식
  },
  member: [
    {
      username: "hello",
      imageUrl:
        "data:image/jpeg;base64,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",
      status: "on",
    },
    {
      username: "world",
      imageUrl:
        "data:image/jpeg;base64,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",
      status: "off",
    },
    {
      username: "안녕",
      imageUrl:
        "data:image/jpeg;base64,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",
      status: "away",
    },
  ], // 내 정보는 포함 x, 멤버 없는 경우 빈 배열 []
  sprint: {
    title: "string",
    startDate: "2024-03-14T12:00:00Z",
    endDate: "2024-04-05T12:00:00Z",
    totalTask: 120,
    completedTask: 120,
    myTotalTask: 30,
    myCompletedTask: 30,
  }, // 진행중인 스프린트가 없는 경우 null
  // sprint: null,
  board: [
    { id: 0, head: "메모 제목", body: "메모 내용", author: "작성자" },
    { id: 1, head: "메모 제목", body: "메모 내용", author: "작성자" },
  ], // 메모가 없는 경우 빈 배열 []
  link: [
    {
      id: 0,
      description: "디자인 피그마",
      url: "https://www.figma.com/file/LmXr1RO0z2n5tzZISnSzB0/Lesser-v2?type=design&node-id=132%3A71&mode=design&t=h72jjqXrHoRX6OoT-1",
    },
    { id: 1, description: "네이버", url: "https://naver.com" },
    {
      id: 2,
      description: "슬랙 팀 채널",
      url: "https://boostcampwm-8-me.slack.com/archives/C065HLL4561",
    },
    {
      id: 3,
      description: "LESSER 레포지토리",
      url: "https://github.com/boostcampwm2023/web10-Lesser",
    },
  ], // 외부 링크가 없는 경우 빈 배열 []
};

const LandingPage = () => {
  const [landingData] = useState<LandingDTO>(sampleData);
  const { projectId } = useParams();
  if (!projectId) throw Error("Invalid Web URL");
  const { project, sprint, member, link } = landingData;

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="h-[17.6875rem] w-full shrink-0 flex gap-9">
        <LandingProject {...{ project, projectId }} />
        <div className="w-full shadow-box rounded-lg"></div>
      </div>
      <div className="h-[20.5625rem] w-full shrink-0 flex gap-9">
        <LandingSprint {...{ sprint }} />
        <LandingMember {...{ member }} />
        <div className="w-full shadow-box rounded-lg flex flex-col pt-6 pl-6 pr-3 bg-gradient-to-tr from-dark-green-linear-from to-dark-green-linear-to">
          <div className="flex justify-between items-center pr-3">
            <p className="text-white text-m font-bold">| 외부 링크</p>
            <Plus width={24} height={24} stroke="#FFFFFF " />
          </div>
          <div className="flex flex-col gap-3 pr-6 py-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-dark-green scrollbar-track-transparent">
            {link.map((linkData: LandingLinkDTO) => {
              return <LandingLinkBlock {...linkData} key={linkData.id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
