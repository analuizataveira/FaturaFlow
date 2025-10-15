import * as z from 'zod';
import mongoose from 'mongoose';

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const objectIdSchema = z.string().refine(isValidObjectId, {
  message: 'Invalid ObjectId',
});

export function mongooseIdDTO(input: unknown) {
  console.log('🔍 [mongooseIdDTO] Input received:', {
    input,
    type: typeof input,
    isObject: typeof input === 'object',
    hasId: typeof input === 'object' && input !== null && 'id' in input
  });

  const id =
    typeof input === 'object' && input !== null && 'id' in input
      ? (input as { id: string }).id
      : input;

  console.log('🔍 [mongooseIdDTO] Extracted ID:', {
    id,
    type: typeof id,
    value: id
  });

  const parsed = objectIdSchema.parse(id);

  console.log('✅ [mongooseIdDTO] Parsed ID:', {
    parsed,
    type: typeof parsed
  });

  return parsed;
}
