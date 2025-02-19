import { MemoColorType } from "../common/landing";

export type MemberStatus = "on" | "off" | "away";

export interface LandingProjectDTO {
  title: string;
  subject: string;
  createdAt: string;
}

export interface LandingMemberDTO {
  id: number;
  username: string;
  imageUrl: string;
  status: MemberStatus;
}

export interface LandingSprintDTO {
  title: string;
  startDate: string;
  endDate: string;
  totalTask: number;
  completedTask: number;
  myTotalTask: number;
  myCompletedTask: number;
}

export interface LandingMemoDTO {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  color: MemoColorType;
}

export interface LandingLinkDTO {
  id: number;
  description: string;
  url: string;
}

export interface LandingDTO {
  project: LandingProjectDTO;
  member: LandingMemberDTO[];
  myInfo: LandingMemberDTO;
  sprint: LandingSprintDTO | null;
  memoList: LandingMemoDTO[];
  linkList: LandingLinkDTO[];
  inviteLinkId: string;
}
