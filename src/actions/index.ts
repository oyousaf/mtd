import { ActionError, defineAction } from 'astro:actions';
import { ENQUIRY_FROM, ENQUIRY_TO, RESEND_API_KEY } from 'astro:env/server';
import { z } from 'astro/zod';
import { Resend } from 'resend';

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const server = {
  enquiry: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().min(2, 'Please enter your name'),
      email: z.email('Please enter a valid email'),
      phone: z.string().trim().min(7, 'Please enter a phone number'),
      service: z.string().optional(),
      business: z.string().trim().min(10, 'Tell us a little about your business').max(2000),
      company: z.string().max(0).optional(), // honeypot
    }),
    handler: async (input) => {
      if (!RESEND_API_KEY) {
        throw new ActionError({ code: 'SERVICE_UNAVAILABLE', message: 'Online enquiries are not set up yet.' });
      }
      const rows = [
        ['Name', input.name],
        ['Email', input.email],
        ['Phone', input.phone],
        ['Service', input.service || 'Not specified'],
        ['Business', input.business],
      ];
      const { error } = await new Resend(RESEND_API_KEY).emails.send({
        from: ENQUIRY_FROM,
        to: ENQUIRY_TO,
        replyTo: input.email,
        subject: `New enquiry from ${input.name}`,
        html: `<h2>New website enquiry</h2><table>${rows
          .map(([k, v]) => `<tr><th align="left" valign="top">${k}</th><td>${escape(v).replace(/\n/g, '<br>')}</td></tr>`)
          .join('')}</table>`,
      });
      if (error) throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'We couldn’t send your enquiry.' });
      return { ok: true };
    },
  }),
};
