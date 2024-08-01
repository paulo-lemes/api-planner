import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { z } from "zod";
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";

type Trip = {
  id: string;
  destination: string;
  starts_at: Date;
  ends_at: Date;
  is_confirmed: boolean;
  created_at: Date;
};

export async function createInvites(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { emails_to_invite } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      const invites = await Promise.all(
        emails_to_invite.map(async (email) => await createInvite(trip, email))
      );

      return { invitedParticipants: invites };
    }
  );
}

async function createInvite(trip: Trip, email: string) {
  const participant = await prisma.participant.create({
    data: {
      email,
      trip_id: trip.id,
    },
  });

  const formattedStartDate = dayjs(trip.starts_at).format("LL");
  const formattedEndDate = dayjs(trip.ends_at).format("LL");

  const mail = await getMailClient();

  const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

  const message = await mail.sendMail({
    from: {
      name: "Equipe plann.er",
      address: "oi@plann.er",
    },
    to: participant.email,
    subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
    html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso você não saiba do que se trata, apenas ignore este e-mail.</p>
        </div>
      `.trim(),
  });

  console.log(nodemailer.getTestMessageUrl(message));

  return { id: participant.id, email: participant.email };
}
