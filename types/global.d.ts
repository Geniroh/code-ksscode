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
