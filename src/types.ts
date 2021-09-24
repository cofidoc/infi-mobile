export type PatientType = {
  id: string;
  socialSecurityNumber: number;
  firstname: string;
  lastname: string;
};

export type OfficeType = {
  name: string;
  finess: string;
  address: string;
  city: string;
  zipCode: string;
};

export type UserType = {
  email: string;
  firstname: string;
  lastname: string;
  officeIds: string[];
};

export type OrdonnanceType = {
  id: string;
  cares: CareType[];
  pictures: {
    id: string;
    path: string;
    date: Date;
  }[];
  nbTotalActs?: number;
  nbActsDo?: number;
};

export type CareType = {
  id: string;
  start: Date;
  end: Date;
  quotation: QuotationType;

  acts?: ActType[];

  morning: boolean;
  midday: boolean;
  afternoon: boolean;
  night: boolean;

  preferredScheduledMorning?: string;
  preferredScheduledMidday?: string;
  preferredScheduledAfternoon?: string;
  preferredScheduledNight?: string;

  bankHoliday: "doNotRegister" | "postpone" | "register";
  everyNDays?: number;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
};

export type ActType = {
  id: string;
  idCare: string;
  patient: PatientType;
  plannedOn: Date;
  time: Time;
  quotation: QuotationType;
  status: "todo" | "not-do" | "done";
  comment?: string;
};

export type QuotationType = {
  id: string;
  name: string;
  keyLetter: KeyLetter;
  coefficient: Coefficient;
  increase: Increase;
};

export type KeyLetter = {
  id: string;
  label: string;
  unitPrice: number;
  unitPriceDom: number;
};

export type Coefficient = {
  id: string;
  value: number;
};

export type Increase = {
  id: string;
  label: string;
  unitPrice: number;
  unitPriceDom: number;
};

export type Time = "morning" | "midday" | "afternoon" | "night";

export type Seance = {
  id: string;
  patient: PatientType;
  acts: ActType[];
  haveIk: boolean;
  increases: Increase[];
  price: string;
  time: Time;
  status: "to-bill" | "not-bill-yet" | "sent-to-billing";
  doneAt?: Date;
  doneBy?: UserType;
  sentToBillingBy?: string;
  dateSentToBilling?: Date;
};
