import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/prisma";

export async function deleteActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/activities/:activityId",
    {
      schema: {
        params: z.object({
          activityId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { activityId } = request.params;

      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      const deletedActivity = await prisma.activity.delete({
        where: {
          id: activityId,
        },
      });

      return { deletedActivity };
    }
  );
}
