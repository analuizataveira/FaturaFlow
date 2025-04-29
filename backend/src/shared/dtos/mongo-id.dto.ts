import * as z from "zod";
import mongoose from "mongoose";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId",
});

export function mongooseIdDTO(input: unknown) {
  console.log("Input received: " + JSON.stringify(input));

  const id =
    typeof input === "object" && input !== null && "id" in input
      ? (input as { id: string }).id
      : input;

  const parsed = objectIdSchema.parse(id);

  console.log("Parsed ID: " + JSON.stringify(parsed));

  return parsed;
}
