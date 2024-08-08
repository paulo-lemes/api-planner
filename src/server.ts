import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { changeNameParticipant } from "./routes/change-name-participant";
import { confirmParticipant } from "./routes/confirm-participant";
import { confirmTrip } from "./routes/confirm-trip";
import { createActivity } from "./routes/create-activity";
import { createInvites } from "./routes/create-invites";
import { createLink } from "./routes/create-link";
import { createTrip } from "./routes/create-trip";
import { deleteActivity } from "./routes/delete-activity";
import { deleteLink } from "./routes/delete-link";
import { deleteParticipant } from "./routes/delete-participant";
import { getActivities } from "./routes/get-activities";
import { getLinks } from "./routes/get-links";
import { getParticipant } from "./routes/get-participant";
import { getParticipants } from "./routes/get-participants";
import { getTripDetails } from "./routes/get-trip-details";
import { updateTrip } from "./routes/update-trip";

const app = fastify();

app.register(cors, {
  origin: env.WEB_BASE_URL,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(getTripDetails);
app.register(confirmTrip);
app.register(updateTrip);
app.register(confirmParticipant);
app.register(changeNameParticipant);
app.register(getParticipants);
app.register(getParticipant);
app.register(deleteParticipant);
app.register(createInvites);
app.register(createActivity);
app.register(getActivities);
app.register(deleteActivity);
app.register(createLink);
app.register(getLinks);
app.register(deleteLink);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("Server running!");
});
