export interface User {
  job: {
    title: string;
    salary: number;
    coworkers: { name: string; phoneNumber: number }[];
  };
  isHappy: boolean;
  matrix: string[][];
  roles: string[];
  name: string;
  age: number;
  friends?: {
    name: string;
    phoneNumber: number;
    bestFriend: { name: string; phoneNumber: number };
    friends: {
      name: string;
      phoneNumber: number;
      friends: { name: string; phoneNumber: number }[];
    }[];
  }[];
  // description: string;
  // payment: [{ obj: [{ obj2: [{ obj3: number[][] }] }] }];
}

export interface IExamModel {
  id: number;
  studentId: number;
  subject: string;
  grade: number;
  date: `${number}-${number}-${number}`;
}

export interface IStudentModel {
  dateJoined: `${number}-${number}-${number}`;
  name: string;
  id: number;
  email: string;
  address: string;
  city: string;
  country: string;
  zip: number;
}

export interface IMonitor extends Pick<IStudentModel, 'id' | 'name'> {
  exams: number;
  average: number;
}
