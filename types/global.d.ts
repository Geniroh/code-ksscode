/* eslint-disable @typescript-eslint/no-explicit-any */

interface ISession {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  userId: string;
  guests?: any[];
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ITag {
  id?: string;
  name: string;
  questions: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IQuestionWithTag {
  id: string;
  title: string;
  content: string;
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  author: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  tags: ITag[];
}

interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean | null;
  image: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface IQuestionWithAnswersAndTags {
  id: string;
  title: string;
  content: string;
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  answered: boolean;
  author: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  user?: IUser;
  answer: any;
  tags: ITag[];
}

interface IAnswer {
  id: string;
  userId: string;
  questionId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
  user?: IUser;
}
