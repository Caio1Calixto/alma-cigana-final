import ZAI from 'z-ai-web-dev-sdk';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const OUT_DIR = '/home/z/my-project/public/images';

const BASE = 'Fotografia profissional de joias para loja boutique elegante.';
const SCENE =
  'Sobre linho creme amassado suavemente, luz natural quente e lateral, sombras suaves, composição minimalista com bastante espaço negativo, estilo editorial sofisticado, riqueza de detalhes, alta qualidade, fotorrealista.';

interface Task {
  file: string;
  size: string;
  prompt: string;
}

const tasks: Task[] = [
  {
    file: 'banner.jpg',
    size: '1344x768',
    prompt:
      'Still life luxuoso de joias douradas finas — colares delicados, anéis e brincos — dispostos sobre tecido de seda marsala vinho profundo com dobras fluidas, luz dourada quente e lateral, atmosfera elegante e misteriosa, tons vinho escuro com reflexos dourados, fotografia editorial de alto padrão, fotorrealista, composição horizontal ampla, alta qualidade.',
  },
  {
    file: 'sobre.jpg',
    size: '1152x864',
    prompt:
      'Flat lay de joias douradas delicadas variadas — colar fino, anéis e brincos — com pétalas de rosa seca e um pequeno ornamento de lua crescente, sobre linho creme, luz quente e lateral, estilo editorial sofisticado, alta qualidade, fotorrealista.',
  },
  {
    file: 'produtos/colar-rosa.jpg',
    size: '864x1152',
    prompt: `${BASE} Colar dourado delicado com pingente de rosa dourada em detalhes, corrente fina. ${SCENE}`,
  },
  {
    file: 'produtos/colar-sol.jpg',
    size: '864x1152',
    prompt: `${BASE} Colar dourado com pingente de sol com raios delicados, corrente fina dourada. ${SCENE}`,
  },
  {
    file: 'produtos/colar-deusa.jpg',
    size: '864x1152',
    prompt: `${BASE} Colar dourado com pingente de lua tríplice (três luas) com pequeno pentagrama ao centro, símbolo místico, corrente fina. ${SCENE}`,
  },
  {
    file: 'produtos/colar-maria.jpg',
    size: '864x1152',
    prompt: `${BASE} Colar dourado marcante com pingente ornamental e pequenos cristais vermelhos rubi, sobre seda marsala vinho escura, luz quente e lateral, sombras suaves, composição minimalista, estilo editorial, alta qualidade, fotorrealista.`,
  },
  {
    file: 'produtos/colar-serpente.jpg',
    size: '864x1152',
    prompt: `${BASE} Colar dourado em formato de serpente serpenteando delicadamente com detalhes de escamas, corrente dourada. ${SCENE}`,
  },
  {
    file: 'produtos/chave-caminhos.jpg',
    size: '864x1152',
    prompt: `${BASE} Colar dourado com pingente de chave antiga ornamentada e detalhada, simbolizando novos caminhos, corrente fina. ${SCENE}`,
  },
  {
    file: 'produtos/bracelete-forca.jpg',
    size: '864x1152',
    prompt: `${BASE} Bracelete rígido dourado rico em detalhes gravados e ornamentos de inspiração boêmia cigana, marcante e trabalhado. ${SCENE}`,
  },
  {
    file: 'produtos/bracelete-serpente.jpg',
    size: '864x1152',
    prompt: `${BASE} Bracelete rígido dourado em formato de serpente enrolada com cabeça detalhada e olhos pequenos. ${SCENE}`,
  },
  {
    file: 'produtos/encanto-cigano.jpg',
    size: '864x1152',
    prompt: `${BASE} Conjunto de três pulseiras douradas boêmias empilhadas com texturas diferentes, elos, contas e detalhes trabalhados. ${SCENE}`,
  },
  {
    file: 'produtos/pulseira-lua.jpg',
    size: '864x1152',
    prompt: `${BASE} Pulseira dourada fina com pequeno pingente de lua crescente e uma estrelinha, delicada. ${SCENE}`,
  },
  {
    file: 'produtos/pulseira-elos.jpg',
    size: '864x1152',
    prompt: `${BASE} Pulseira dourada de elos interligados delicados, corrente elegante com fecho pequeno. ${SCENE}`,
  },
  {
    file: 'produtos/anel-lua.jpg',
    size: '864x1152',
    prompt: `${BASE} Anel dourado fino com lua crescente e pequena estrela, joia delicada em close. ${SCENE}`,
  },
  {
    file: 'produtos/anel-rosa.jpg',
    size: '864x1152',
    prompt: `${BASE} Anel dourado minimalista com pequena rosa dourada esculpida, joia delicada em close. ${SCENE}`,
  },
  {
    file: 'produtos/brincos-lua.jpg',
    size: '864x1152',
    prompt: `${BASE} Par de brincos dourados com gotas em formato de lua crescente delicada, pendentes finos. ${SCENE}`,
  },
  {
    file: 'produtos/brincos-estrela.jpg',
    size: '864x1152',
    prompt: `${BASE} Par de brincos dourados pequenos em formato de estrela de quatro pontas, delicados e brilhantes. ${SCENE}`,
  },
];

async function generateOne(task: Task): Promise<boolean> {
  const out = path.join(OUT_DIR, task.file);
  if (fs.existsSync(out) && fs.statSync(out).size > 10000) {
    console.log('SKIP (já existe):', task.file);
    return true;
  }
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const zai = await ZAI.create();
      const res = await zai.images.generations.create({
        prompt: task.prompt,
        size: task.size,
      });
      const b64 = res?.data?.[0]?.base64;
      if (!b64) throw new Error('resposta vazia da API de imagens');
      const buf = Buffer.from(b64, 'base64');
      await fs.promises.mkdir(path.dirname(out), { recursive: true });
      await sharp(buf).jpeg({ quality: 82 }).toFile(out);
      console.log('OK:', task.file, `(${Math.round(fs.statSync(out).size / 1024)} KB)`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`FALHA ${task.file} tentativa ${attempt}: ${msg}`);
      await new Promise((r) => setTimeout(r, 15000 * attempt));
    }
  }
  console.error('DESISTIU:', task.file);
  return false;
}

async function main() {
  for (const task of tasks) {
    await generateOne(task);
    await new Promise((r) => setTimeout(r, 6000));
  }
  console.log('CONCLUÍDO');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
