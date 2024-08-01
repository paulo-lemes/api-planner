import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { confirmParticipant } from "./routes/confirm-participant";
import { confirmTrip } from "./routes/confirm-trip";
import { createTrip } from "./routes/create-trip";
import { deleteParticipant } from "./routes/delete-participant";
import { getParticipant } from "./routes/get-participant";
import { getParticipants } from "./routes/get-participants";
import { getTripDetails } from "./routes/get-trip-details";
import { updateTrip } from "./routes/update-trip";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(getTripDetails);
app.register(confirmTrip);
app.register(updateTrip);
app.register(confirmParticipant);
app.register(getParticipants);
app.register(getParticipant);
app.register(deleteParticipant);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!");
});
