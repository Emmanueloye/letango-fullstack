export type Group = {
  _id: string;
  groupRef: string;
  groupName: string;
  groupType: string;
  groupPurpose: string;
  photo: string;
  photoPublicId: string;
  groupDescription: string;
  owner: string;
  groupBalance: number;
  approvalAuthorities: string[];
  groupCode?: string;
  createdAt: Date;
};

export type Member = {
  _id: string;
  memberId: string;
  groupId: Group;
  groupRef: string;
  role: string;
  joinedAt: Date;
};

export type IPages = {
  totalPages: number;
  currentPage: number;
  nextPage: number;
  previousPage: number;
  baseLink: string;
};

export type IMember = {
  _id: string;
  memberId: {
    _id: string;
    surname: string;
    otherNames: string;
  };
  groupId: string;
  groupRef: string;
  role: 'member' | 'admin';
  status: boolean;
  joinedAt: Date;
};

export type IFundHead = {
  _id: string;
  groupRef: string;
  groupId: string;
  head: string;
  headType: string;
  isActive: boolean;
  createdAt: Date;
};

export type Sender = {
  _id: string;
  surname: string;
  otherNames: string;
  photo: string;
};

export type IChat = {
  _id: string;
  groupId: string;
  groupRef: string;
  sender: string;
  senderName: string;
  content: string;
  likesCount?: number;
  dislikesCount?: number;
};
