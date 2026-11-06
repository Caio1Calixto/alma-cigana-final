import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const categories = [
  {
    slug: 'colares',
    name: 'Colares',
    description: 'Pingentes com símbolos e histórias para usar perto do coração.',
    order: 1,
  },
  {
    slug: 'braceletes-pulseiras',
    name: 'Braceletes & Pulseiras',
    description: 'Peças marcantes para compor o seu estilo, do delicado ao imponente.',
    order: 2,
  },
  {
    slug: 'aneis',
    name: 'Anéis',
    description: 'Detalhes pequenos com grande significado para o dia a dia.',
    order: 3,
  },
  {
    slug: 'brincos',
    name: 'Brincos',
    description: 'Toques finais de luz e elegância para qualquer ocasião.',
    order: 4,
  },
];

const products = [
  // ——— Colares ———
  {
    slug: 'colar-rosa-dourada',
    name: 'Colar Rosa Dourada',
    category: 'colares',
    price: 59.9,
    featured: true,
    image: '/images/produtos/colar-rosa.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Corrente ajustável de 40 a 45 cm · pingente de rosa em relevo',
    description:
      'A delicadeza de uma rosa transformada em joia. Com seu acabamento dourado e desenho delicado, este colar traz elegância e personalidade para qualquer ocasião.',
  },
  {
    slug: 'colar-pingente-de-sol',
    name: 'Colar Pingente de Sol',
    category: 'colares',
    price: 64.9,
    featured: true,
    image: '/images/produtos/colar-sol.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Corrente de 45 cm · pingente de sol com raios trabalhados',
    description:
      'O sol como amuleto de energia e novos começos. Seus raios delicados capturam a luz em cada movimento, iluminando o look com simbolismo e brilho.',
  },
  {
    slug: 'colar-deusa-triplice',
    name: 'Colar Deusa Tríplice',
    category: 'colares',
    price: 74.9,
    featured: true,
    image: '/images/produtos/colar-deusa.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Corrente de 45 cm com extensão · pingente de lua tríplice com pentagrama',
    description:
      'Uma joia que reúne dois símbolos marcantes da espiritualidade. A Lua Tríplice representa os ciclos da vida e os três aspectos da Deusa: Donzela, Mãe e Anciã. Ao centro, o Pentagrama é associado à conexão com os cinco elementos: Terra, Água, Fogo, Ar e Espírito.',
  },
  {
    slug: 'colar-encanto-de-maria-padilha',
    name: 'Colar Encanto de Maria Padilha',
    category: 'colares',
    price: 69.9,
    featured: true,
    image: '/images/produtos/colar-maria.jpg',
    material: 'Semijoia em banho de ouro 18k com cristais',
    details: 'Corrente de 45 cm · pingente ornamental com cristais vermelhos',
    description:
      'Uma joia marcante, com a força do vermelho e a elegância do dourado. Inspirado na presença de Maria Padilha, este colar carrega simbolismos de poder, magnetismo, autoestima e feminilidade.',
  },
  {
    slug: 'colar-serpente',
    name: 'Colar Serpente',
    category: 'colares',
    price: 67.9,
    featured: false,
    image: '/images/produtos/colar-serpente.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Corrente de 45 cm · pingente serpente com textura de escamas',
    description:
      'A serpente que atravessa histórias e culturas como símbolo de transformação e renovação. Neste colar, ela serpenteia com delicadeza dourada, despertando olhares e significados.',
  },
  {
    slug: 'chave-dos-caminhos',
    name: 'Chave dos Caminhos',
    category: 'colares',
    price: 62.9,
    featured: false,
    image: '/images/produtos/chave-caminhos.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Corrente de 50 cm · pingente de chave ornamentada',
    description:
      'Um símbolo de novas possibilidades, oportunidades e caminhos que se abrem. Uma joia para quem acredita na força dos símbolos e gosta de carregar consigo significados especiais.',
  },
  // ——— Braceletes & Pulseiras ———
  {
    slug: 'bracelete-forca-cigana',
    name: 'Bracelete Força Cigana',
    category: 'braceletes-pulseiras',
    price: 79.9,
    featured: true,
    image: '/images/produtos/bracelete-forca.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Bracelete rígido, abertura flexível · ornamentos gravados',
    description:
      'Uma peça marcante, rica em detalhes e cheia de personalidade. Seu dourado e seus desenhos delicados remetem à beleza, à tradição e à força da estética cigana.',
  },
  {
    slug: 'bracelete-serpente',
    name: 'Bracelete Serpente',
    category: 'braceletes-pulseiras',
    price: 74.9,
    featured: false,
    image: '/images/produtos/bracelete-serpente.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Bracelete rígido em formato de serpente · ajuste suave no punho',
    description:
      'Enrolada com graça no punho, a serpente dourada guarda o simbolismo da sabedoria e da proteção. Um bracelete escultural que transforma qualquer composição em declaração.',
  },
  {
    slug: 'encanto-cigano',
    name: 'Encanto Cigano — Trio de Pulseiras',
    category: 'braceletes-pulseiras',
    price: 89.9,
    featured: true,
    image: '/images/produtos/encanto-cigano.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Trio de pulseiras com texturas distintas · uso combinado ou separado',
    description:
      'Com acabamento trabalhado e detalhes dourados, estas pulseiras trazem personalidade e sofisticação para compor seu estilo. Use juntas para um visual marcante ou separadas para o dia a dia.',
  },
  {
    slug: 'pulseira-lua-e-estrela',
    name: 'Pulseira Lua & Estrela',
    category: 'braceletes-pulseiras',
    price: 54.9,
    featured: false,
    image: '/images/produtos/pulseira-lua.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Corrente de 18 cm com extensão de 2 cm · pingentes de lua e estrela',
    description:
      'Delicada como o céu da noite, esta pulseira reúne a lua e a estrela — os dois símbolos que assinam a Alma Cigana — em um toque discreto e cheio de significado.',
  },
  {
    slug: 'pulseira-elos-delicados',
    name: 'Pulseira Elos Delicados',
    category: 'braceletes-pulseiras',
    price: 49.9,
    featured: false,
    image: '/images/produtos/pulseira-elos.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Corrente de elos interligados, 18 cm com extensão de 2 cm',
    description:
      'Elos dourados que se entrelaçam como fios de uma história. Uma pulseira versátil e elegante, perfeita para usar sozinha ou combinada com outras peças.',
  },
  // ——— Anéis ———
  {
    slug: 'anel-lua-e-estrela',
    name: 'Anel Lua & Estrela',
    category: 'aneis',
    price: 39.9,
    featured: true,
    image: '/images/produtos/anel-lua.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Anel fino ajustável · lua crescente com pequena estrela',
    description:
      'Um pedacinho do céu noturno no seu dedo. O anel fino reúne a lua crescente e a estrela em traço delicado, perfeito para o uso diário ou para presentear alguém especial.',
  },
  {
    slug: 'anel-rosa-eterna',
    name: 'Anel Rosa Eterna',
    category: 'aneis',
    price: 42.9,
    featured: false,
    image: '/images/produtos/anel-rosa.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Anel ajustável · rosa esculpida em miniatura',
    description:
      'A rosa que nunca murcha. Esculpida em miniatura, esta flor dourada traduz a beleza e a força que florescem mesmo diante dos desafios — a essência da Alma Cigana.',
  },
  // ——— Brincos ———
  {
    slug: 'brincos-gotas-de-lua',
    name: 'Brincos Gotas de Lua',
    category: 'brincos',
    price: 44.9,
    featured: true,
    image: '/images/produtos/brincos-lua.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Brincos pendentes · luas crescentes com fecho gancho',
    description:
      'Gotas de luar para iluminar o rosto. Estes brincos pendentes reúnem leveza e simbolismo, movendo-se com graça a cada passo.',
  },
  {
    slug: 'brincos-estrela-dourada',
    name: 'Brincos Estrela Dourada',
    category: 'brincos',
    price: 39.9,
    featured: false,
    image: '/images/produtos/brincos-estrela.jpg',
    material: 'Semijoia em banho de ouro 18k',
    details: 'Brincos pequenos · estrelas de quatro pontas com fecho gancho',
    description:
      'Pequenas estrelas de quatro pontas para brilhar com discrição. Delicados e versáteis, acompanham você do dia à noite com um toque de encanto.',
  },
];

async function main() {
  console.log('Populando categorias…');
  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, order: c.order },
      create: c,
    });
  }

  console.log('Populando produtos…');
  let i = 0;
  for (const p of products) {
    i += 1;
    const category = await db.category.findUnique({ where: { slug: p.category } });
    if (!category) throw new Error(`Categoria não encontrada: ${p.category}`);
    await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        material: p.material,
        details: p.details,
        price: p.price,
        image: p.image,
        featured: p.featured,
        categoryId: category.id,
        order: i,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        material: p.material,
        details: p.details,
        price: p.price,
        image: p.image,
        featured: p.featured,
        categoryId: category.id,
        order: i,
      },
    });
  }

  const ordersCount = await db.order.count();
  if (ordersCount === 0) {
    console.log('Criando pedidos de exemplo…');
    const colarRosa = await db.product.findUnique({ where: { slug: 'colar-rosa-dourada' } });
    const anelLua = await db.product.findUnique({ where: { slug: 'anel-lua-e-estrela' } });
    const brincosLua = await db.product.findUnique({ where: { slug: 'brincos-gotas-de-lua' } });
    if (colarRosa && anelLua && brincosLua) {
      await db.order.create({
        data: {
          code: 'AC-EXEMPLO01',
          customerName: 'Mariana Duarte',
          email: 'mariana@example.com',
          phone: '(11) 98888-1234',
          cep: '03178-200',
          address: 'Rua Serra de Bragança, 112 — apto 54',
          city: 'São Paulo',
          state: 'SP',
          paymentMethod: 'pix',
          subtotal: colarRosa.price + anelLua.price,
          shipping: 0,
          discount: 0,
          total: colarRosa.price + anelLua.price,
          status: 'confirmado',
          items: {
            create: [
              { productId: colarRosa.id, name: colarRosa.name, price: colarRosa.price, quantity: 1 },
              { productId: anelLua.id, name: anelLua.name, price: anelLua.price, quantity: 1 },
            ],
          },
        },
      });
      await db.order.create({
        data: {
          code: 'AC-EXEMPLO02',
          customerName: 'Camila Rocha',
          email: 'camila@example.com',
          phone: '(11) 97777-4321',
          cep: '01310-100',
          address: 'Av. Paulista, 1000 — cj 74',
          city: 'São Paulo',
          state: 'SP',
          paymentMethod: 'cartao',
          subtotal: brincosLua.price * 2,
          shipping: 19.9,
          discount: 0,
          total: brincosLua.price * 2 + 19.9,
          status: 'preparando',
          items: {
            create: [
              { productId: brincosLua.id, name: brincosLua.name, price: brincosLua.price, quantity: 2 },
            ],
          },
        },
      });
    }
  }

  console.log('Seed concluído ✔');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
