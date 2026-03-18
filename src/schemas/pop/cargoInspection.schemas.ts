import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

const questionField = () => boolean().nullable().default(null);

export const cargoInspectionFormSchema = object({
  driver: string().trim().required().max(70),
  license_plate: string().trim().required().min(7).max(7),
  invoice: string().trim().required().max(25),
  product: string().trim().required().max(30),
  inbound: boolean().nullable().default(null),
  outbound: boolean().nullable().default(null),
  question1: questionField(),
  question2: questionField(),
  question3: questionField(),
  question4: questionField(),
  question5: questionField(),
  question6: questionField(),
  question7: questionField(),
  question8: questionField(),
  question9: questionField(),
  question10: questionField(),
  question11: questionField(),
  question12: questionField(),
  question13: questionField(),
  question14: questionField(),
  question15: questionField(),
  question16: questionField(),
  question17: questionField(),
  question18: questionField(),
  question19: questionField(),
  monitored_by: string().trim().required().max(70),
  verified_by: string().trim().required().max(70),
  note: string().trim().nullable().max(5000).default(null),
});

export type CargoInspectionForm = InferType<typeof cargoInspectionFormSchema>;

export const cargoInspectionListItemSchema = object({
  id: number().required(),
  driver: string().trim().required(),
  license_plate: string().trim().required(),
  product: string().trim().required(),
  invoice: string().trim().required(),
  inbound: boolean().nullable().default(null),
  outbound: boolean().nullable().default(null),
  created_at: string().required(),
});

export type CargoInspectionListItem = InferType<typeof cargoInspectionListItemSchema>;

export const cargoInspectionListRequestSchema = paginationRequestSchema;
export type CargoInspectionListRequest = InferType<typeof cargoInspectionListRequestSchema>;

export const cargoInspectionDetailSchema = cargoInspectionFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type CargoInspectionDetail = InferType<typeof cargoInspectionDetailSchema>;
