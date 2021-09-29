// Patient
export type PatientType = {
  id: string;
  socialSecurityNumber: number;
  firstname: string;
  lastname: string;
  birth: Date;
  phoneNumber: string;
  relocation: Relocation;
  kmSupp: number;
};

// Cabinet
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

// Ordonnance
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

// Soin
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

// Act
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

// Cotation
export type QuotationType = {
  id: string;
  name: string;
  keyLetter: KeyLetter;
  coefficient: Coefficient;
  increase: Increase;
};

// Lettre Clé
export type KeyLetter = {
  id: string;
  label: string;
  unitPrice: number;
  unitPriceDom: number;
};

// Coefficient
export type Coefficient = {
  id: string;
  value: number;
};

// Majoration
export type Increase = {
  id: string;
  label: string;
  unitPrice: number;
  unitPriceDom: number;
};

// frais kilometrique
export type Relocation = {
  id: string;
  label: string;
  unitPrice: number;
  unitPriceDom: number;
};

// Moment de la journée
export type Time = "morning" | "midday" | "afternoon" | "night";

// séance
export type SeanceType = {
  id: string;
  patient: PatientType;
  acts: ActType[];
  ik: "domicile" | "cabinet";
  increases: Increase[];
  price: string;
  time: Time;
  status: "to-bill" | "not-bill-yet" | "sent-to-billing";
  doneAt?: Date;
  doneBy?: UserType;
  sentToBillingBy?: string;
  dateSentToBilling?: Date;
};

// cotataion liée
export type LinkedQuotation = {
  id: string;
  linkedQuotations: QuotationType[];
  quotations: QuotationType[];
};
