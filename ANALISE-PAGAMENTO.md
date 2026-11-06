# Análise técnica — o sistema de pagamento da Alma Cigana é funcional?

**Data:** 06/11/2026 · **Escopo:** todo o repositório (`alma-cigana-final`) · **Commit analisado:** `680c9c1`

---

## Veredito curto

**Não. Não existe sistema de pagamento — existe um sistema de *pedido*.**

O site capta o pedido, calcula o total no servidor e grava no banco corretamente. Mas **nenhum valor é cobrado, autorizado, conciliado ou confirmado**. Não há gateway, não há cobrança Pix, não há link de cartão, não há boleto emitido, não há webhook, e não existe sequer um campo no banco para dizer se o pedido foi pago.

Toda a etapa financeira é **manual, por WhatsApp**, feita por uma pessoa fora do sistema.

O que funciona de verdade hoje: **vitrine → sacola → checkout → registro do pedido → página de acompanhamento → painel de pedidos.**

---

## Como cheguei a essa conclusão

Subi a aplicação localmente (`next dev`, porta 3000) e exercitei as rotas de verdade, além de ler todo o código.

### 1. Nenhuma integração de pagamento existe

Busca em todo o projeto por `stripe`, `mercadopago`, `pagseguro`, `pagarme`, `asaas`, `efi`, `gerencianet`, `pix`, `qrcode`, `webhook`, `gateway`:

- **Zero** dependências de pagamento no `package.json`
- **Zero** chamadas HTTP externas no código
- **Zero** rotas de webhook ou callback

As únicas ocorrências de "pix" são textos de interface e um valor de enum.

### 2. O pedido nasce "confirmado" mesmo sem pagamento

`src/app/api/orders/route.ts:95`

```ts
status: 'confirmado',
```

Isso é gravado **igual para Pix, cartão e boleto**, no momento do clique, antes de qualquer dinheiro existir. Consequências:

- A tela mostra **"Pedido confirmado ✦"** (`pedido.tsx:110`) mesmo para boleto, que vence em 3 dias úteis e pode nunca ser pago.
- O painel `#/loja` soma esses pedidos em **"Faturamento"** — ou seja, **receita que não entrou** aparece como faturamento.

### 3. O banco não tem onde guardar o estado do pagamento

Em `prisma/schema.prisma`, o model `Order` tem: `code`, dados de entrega, `paymentMethod`, valores, `couponCode`, `status`, `createdAt`.

**Não existem:** `paymentStatus`, `paidAt`, `transactionId`/`gatewayRef`, `paymentUrl`, `pixQrCode`, `pixCopiaECola`, chave de idempotência, nem log de webhooks.

Na prática, **não há como representar "pago", "aguardando", "expirado" ou "reembolsado"**. Adicionar um gateway depois exigirá migração de schema.

### 4. As instruções de pagamento são texto fixo

`src/components/site/views/pedido.tsx:11-28`

```ts
case 'pix':
  return { title: 'Pagamento via Pix', text: 'A chave Pix e as instruções serão enviadas agora mesmo pelo WhatsApp da loja...' }
case 'cartao':
  return { text: 'Você receberá um link de pagamento seguro pelo WhatsApp...' }
case 'boleto':
  return { text: 'O boleto será enviado para o seu e-mail...' }
```

É string estática. Não gera nada. Não envia nada.

**O boleto é a maior quebra de promessa:** o texto diz que ele será enviado por e-mail, mas o projeto **não tem nenhuma biblioteca de envio de e-mail** (nem `nodemailer`, nem `resend`, nem SMTP). O boleto nunca sai.

### 5. O status do pedido é imutável na prática

Existe `GET` e `POST` em `/api/orders`. **Não existe `PATCH`/`PUT`.** O mapa `ORDER_STATUS` tem `preparando`, `enviado`, `entregue` — mas **nada no sistema consegue aplicar esses status**. A loja não tem como marcar um pedido como pago, produzido ou enviado; isso só muda editando o banco à mão.

### 6. Não há controle de estoque

`quantity` é limitado a 10 por item no schema de validação, mas **não existe campo de estoque nem reserva**. O mesmo colar pode ser vendido infinitas vezes.

---

## O que **está** funcional e bem feito

Não é tudo negativo — a base é sólida:

| Item | Situação |
|---|---|
| Recálculo de preço **no servidor** | ✅ `orders/route.ts:76-79` busca preço no banco. O cliente nunca envia o preço. Impossível fraudar valor. |
| Validação de entrada | ✅ Zod com e-mail, UF de 2 letras, quantidade, carrinho não vazio |
| Cupom validado no servidor | ✅ Cupom inexistente → `400` |
| Persistência do pedido + itens | ✅ Criação aninhada, gravou corretamente (verificado no banco) |
| Consulta por código | ✅ `GET /api/orders/AC-…` → 200 com pedido; código inválido → 404 |
| Cálculo de frete/cupom | ✅ Consistente entre carrinho, checkout e servidor |
| Código de pedido | ✅ Formato `AC-…`, único, indexado |

---

## Problemas graves que encontrei (além do pagamento)

### 🔴 P1 — Qualquer pessoa vê os dados de todos os clientes

`GET /api/orders` **não tem autenticação** e devolve **todos** os pedidos com **nome, e-mail, telefone, endereço completo e CEP**.

E o painel `#/loja` está linkado no **rodapé público** do site:

```
src/components/site/footer.tsx:126   onClick={() => navigateTo('#/loja')}
```

Teste real: `curl http://localhost:3000/api/orders` → lista completa com dados pessoais, sem login.

**Isso é exposição de dados pessoais (LGPD) e vazamento de clientes para concorrentes.**

### 🔴 P2 — Dados reais de clientes comitados no Git

`db/custom.db` está **versionado** e contém pedidos reais:

```
Caio Calixto      caio.callixto1@gmail.com   +5511978476732
Maria Silva Santos maria.santos@email.com.br  (11) 99772-1481
```

Além disso, `.env` está versionado (e aponta para `/home/z/my-project`, caminho que não existe fora do ambiente original). O `.gitignore` ignora `.env*`, mas o arquivo **entrou antes da regra** e continua rastreado.

### 🟠 P3 — Mensagens de erro em inglês para o cliente

O `400` devolve a mensagem crua do Zod (`orders/route.ts:44`):

```
{"error":"Too big: expected number to be <=10"}
{"error":"Invalid option: expected one of \"pix\"|\"cartao\"|\"boleto\""}
```

Esses textos aparecem no toast do checkout. Só os campos com `.min()`/`.regex()` têm mensagem traduzida.

### 🟠 P4 — Itens indisponíveis são descartados em silêncio

`orders/route.ts:65-75` faz `flatMap` e **descarta** produtos que não existem/estão inativos. Se o carrinho tem 3 itens e 1 saiu de linha, o pedido é criado com 2 — **por um total menor, sem avisar o cliente**. O certo é retornar erro listando o que saiu.

### 🟠 P5 — O cupom ALMA10 anula o frete grátis

`calcTotals` aplica o desconto **antes** de testar o frete grátis (`site.ts:66-67`). Resultado em R$ 199,00:

| | Sem cupom | Com ALMA10 |
|---|---|---|
| Subtotal | 199,00 | 199,00 |
| Desconto | — | −19,90 |
| Frete | **grátis** | **19,90** |
| **Total** | **199,00** | **199,00** |

O cliente vê "10% de desconto" e paga **exatamente o mesmo**. Entre R$ 199 e R$ 221,11 o desconto real é praticamente zero.

### 🟡 P6 — Sem rate limit e código de pedido previsível

- Nada impede criar milhares de pedidos falsos em loop.
- O código é `AC-` + 6 chars do timestamp + **4 chars de `Math.random()`** — a parte aleatória tem ~1,7 milhão de combinações, e o resto é adivinhável. Com `GET /api/orders/{code}` sem limite de tentativas, dá para enumerar pedidos e ler endereço e telefone de clientes.
- Sem tratamento de colisão: se o código repetir, o cliente recebe um `500` genérico.

### 🟡 P7 — Vitrine promete o que o sistema não faz

- `contato.tsx:17` — *"Pix (aprovação imediata)"* → não há aprovação nenhuma, é manual.
- `site.ts:33` — *"Cartão: link de pagamento seguro"* → nenhum link é gerado.
- `site.ts:38` — *"Boleto: enviado por e-mail"* → nenhum e-mail é enviado.

### 🟡 P8 — Pedidos de exemplo contaminam o faturamento

O seed cria `AC-EXEMPLO01` e `AC-EXEMPLO02`, e o `custom.db` comitado **já vem com eles**. O painel soma tudo em "Faturamento".

---

## Fluxo real, hoje

```
Cliente escolhe peça
   → sacola (localStorage)
   → checkout preenche dados + escolhe "forma de pagamento"
   → POST /api/orders  ← ÚNICO ponto de contato com o "pagamento"
        ├─ recalcula total no servidor ✅
        ├─ valida cupom ✅
        └─ grava status = "confirmado"  ❌ (pago? não se sabe)
   → tela "Pedido confirmado ✦"
   → botão "Falar com a loja no WhatsApp"
   → 🧑 humano combina Pix/link/boleto por fora
   → 🧑 humano marca como pago... editando o banco, porque não há como
```

**O sistema termina onde o pagamento começa.**

---

## O que falta para ser realmente funcional

### Nível 1 — Fechar as brechas (urgente, independe de gateway)

1. **Proteger `GET /api/orders`** — exigir sessão/segredo de admin e **remover o link público** do rodapé.
2. **Remover `db/custom.db` e `.env` do Git** (`git rm --cached`) e gerar um `.env.example`.
3. **Não usar `confirmado` como padrão** — usar `aguardando_pagamento`.
4. **Traduzir os erros do Zod** (usar `errorMap` ou mapear `issue.code`).
5. **Falhar** quando algum item do carrinho estiver indisponível, em vez de descartar.
6. **Rate limit** no `POST /api/orders` e no `GET /api/orders/{code}`.

### Nível 2 — Virar um sistema de pagamento de verdade

7. **Adicionar ao model `Order`:**
   ```prisma
   paymentStatus String  @default("pending") // pending | paid | expired | refunded | failed
   paidAt        DateTime?
   gateway       String?
   gatewayRef    String?   @unique
   paymentUrl    String?
   ```
8. **Escolher um gateway** (Mercado Pago, Asaas e Pagar.me têm Pix + cartão + boleto com webhook). Para Pix imediato, o caminho é: criar cobrança → devolver `qr_code` + `copia_e_cola` para a tela do pedido.
9. **Webhook assinado** (`POST /api/webhooks/{gateway}`) que valida a assinatura e faz `paymentStatus = paid` + `paidAt` **de forma idempotente**.
10. **Só então** mudar o status do pedido para `confirmado` / liberar produção.
11. **Endpoint `PATCH /api/orders/{code}`** protegido, para a loja mover `preparando → enviado → entregue`.
12. **Separar "faturamento" de "recebido"** no painel: somar só `paymentStatus = paid`.

### Nível 3 — Correções de negócio

13. **Calcular o frete grátis sobre o subtotal bruto** (ou deixar explícito que o cupom zera o benefício), senão o ALMA10 é propaganda enganosa em R$ 199.
14. **Estoque/reserva** por produto.
15. **Ajustar os textos** do site para refletir o que é real enquanto o gateway não entra.

---

## Resposta direta

> **"O sistema de pagamento é verdadeiramente funcional?"**

**Não.** Ele é um **excelente sistema de pedidos** — validação boa, cálculo confiável no servidor, persistência correta — mas **não processa dinheiro**. O "pagamento" é um campo de texto, um `status` fixo em `"confirmado"` e uma conversa de WhatsApp.

Se a pergunta for *"consigo receber pedidos pelo site hoje?"* — **sim**, e com a ressalva de que qualquer um pode ler os dados de todos os seus clientes pelo painel público. Se for *"o site cobra, confirma e concilia pagamentos?"* — **não, em nenhum dos três métodos anunciados**.

O trabalho de front-end, catálogo, checkout e modelagem está em nível de produção. A camada de pagamento, porém, **não foi construída** — foi **representada** na interface.
