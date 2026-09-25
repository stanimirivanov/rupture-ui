import Fastify from 'fastify';
import cors from '@fastify/cors';

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

const hypotheses = JSON.parse(
  await readFile(join(here, 'hypotheses.json'), 'utf8'),
);

const app = Fastify({ logger: false });

// The preview build and the mock server run on different ports, so they
// are different origins. `origin: true` reflects the request's Origin
// header, which is acceptable for a local mock server. Do not carry this
// setting into a real server.
await app.register(cors, { origin: true });

app.get('/api/hypotheses', async () => hypotheses);

app.post('/api/hypotheses/:id/:action', async (request, reply) => {
  const { id, action } = request.params;
  const hypothesis = hypotheses.find((h) => h.id === id);
  if (!hypothesis) return reply.code(404).send({ message: 'Not found' });
  if (!['approve', 'edit', 'intercept'].includes(action)) {
    return reply.code(400).send({ message: 'Unknown action' });
  }

  if (action === 'edit') {
    // Only `edit` carries a body. Guard against a missing or malformed one
    // so the error message is explicit rather than a generic 400.
    const body = request.body;
    if (
      typeof body !== 'object' ||
      body === null ||
      typeof body.proposedStrength !== 'number'
    ) {
      return reply
        .code(400)
        .send({ message: 'edit requires proposedStrength: number' });
    }
    hypothesis.proposedStrength = body.proposedStrength;
  }

  return {
    kind: action,
    hypothesis,
    occurredAt: new Date().toISOString(),
  };
});

const port = Number(process.env.PORT ?? 4301);
app.listen({ port, host: '127.0.0.1' }).catch((error) => {
  console.error(error);
  process.exit(1);
});
