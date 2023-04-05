import { Response } from "express";
declare const countingTimeWorkInDay: () => Promise<void>;
declare const countingSalary: () => Promise<void>;
declare const test: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const attendance: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const getAttendance: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const getWorking: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export { attendance, countingTimeWorkInDay, test, countingSalary, getAttendance, getWorking };
