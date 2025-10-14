import { RoomCategoryDto } from "@/services/api-client";

export type RoomCategoryFull = {
  hospital: string;
  hospitalId: string;
  roomCatagory: RoomCategoryDto;
  prioritySeq: number;
  printSeq: number;
  defaultRates: number;
  status: string;
  modifiedOn: string;
  modifiedById: string;
  modifiedBy: string;
  createdOn: string;
  createdById: string;
  createdBy: string;
};

export const dummyRoomCategories: RoomCategoryFull[] = [
  {
    hospital: "City Hospital",
    hospitalId: "hosp-001",
    roomCatagory: {
      id: "rc-001",
      categoryName: "Deluxe Room",
      percent: 20,
    },
    prioritySeq: 1,
    printSeq: 10,
    defaultRates: 5000,
    status: "Active",
    modifiedOn: "2024-06-10T14:22:00Z",
    modifiedById: "emp-101",
    modifiedBy: "Ananya Sharma",
    createdOn: "2024-05-01T10:15:00Z",
    createdById: "emp-100",
    createdBy: "John Smith",
  },
  {
    hospital: "Green Valley Hospital",
    hospitalId: "hosp-002",
    roomCatagory: {
      id: "rc-002",
      categoryName: "Standard Ward",
      percent: 10,
    },
    prioritySeq: 2,
    printSeq: 20,
    defaultRates: 2500,
    status: "Inactive",
    modifiedOn: "2024-06-15T09:45:00Z",
    modifiedById: "emp-102",
    modifiedBy: "Raj Patel",
    createdOn: "2024-04-18T08:30:00Z",
    createdById: "emp-101",
    createdBy: "Ananya Sharma",
  },
  {
    hospital: "Sunrise Clinic",
    hospitalId: "hosp-003",
    roomCatagory: {
      id: "rc-003",
      categoryName: "Private Suite",
      percent: 35,
    },
    prioritySeq: 3,
    printSeq: 30,
    defaultRates: 8000,
    status: "Active",
    modifiedOn: "2024-07-01T12:10:00Z",
    modifiedById: "emp-103",
    modifiedBy: "Samantha Lee",
    createdOn: "2024-06-10T11:00:00Z",
    createdById: "emp-102",
    createdBy: "Michael Brown",
  },
  {
    hospital: "Unity Hospital",
    hospitalId: "hosp-004",
    roomCatagory: {
      id: "rc-004",
      categoryName: "ICU",
      percent: 50,
    },
    prioritySeq: 4,
    printSeq: 40,
    defaultRates: 12000,
    status: "Active",
    modifiedOn: "2024-07-05T09:30:00Z",
    modifiedById: "emp-104",
    modifiedBy: "Arjun Mehta",
    createdOn: "2024-06-20T14:00:00Z",
    createdById: "emp-105",
    createdBy: "Neha Verma",
  },
  {
    hospital: "Global Care",
    hospitalId: "hosp-005",
    roomCatagory: {
      id: "rc-005",
      categoryName: "General Ward",
      percent: 5,
    },
    prioritySeq: 5,
    printSeq: 50,
    defaultRates: 1800,
    status: "Inactive",
    modifiedOn: "2024-07-08T17:45:00Z",
    modifiedById: "emp-106",
    modifiedBy: "Devanshi Rana",
    createdOn: "2024-07-01T08:20:00Z",
    createdById: "emp-107",
    createdBy: "Rajeev Kapoor",
  },
];

