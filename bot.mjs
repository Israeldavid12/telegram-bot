import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import qrcode from "qrcode";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🔑 Credenciais da BlackCat
const publicKey = "pk_2muW-gXa0vYdqRPvcbvajbT5ZUvQsZSE4VxV3b7L9uhsBvEm";
const secretKey = "sk_TQ9iupHFAWeqxtqqC6fKxX5t7aYzh62pH_QZbChMMb8Nb2TU";
const auth = "Basic " + Buffer.from(publicKey + ":" + secretKey).toString("base64");

// 💰 Função que cria pagamento PIX
async function criarPagamento(valorCentavos) {
  const payload = {
    pix: { expiresInDays: 2 },
    items: [{ tangible: false, quantity: 1, unitPrice: valorCentavos, title: "Plano Vitalício + VIP BLACK" }],
    customer: {
      document: { type: "cpf", number: "333333333" },
      name: "Cliente Telegram",
      email: "email@teste.com",
      phone: "870000000"
    },
    amount: valorCentavos,
    paymentMethod: "pix",
    currency: "BRL"
  };

  const response = await fetch("https://api.blackcatpagamentos.com/v1/transactions", {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return await response.json();
}

// 🧭 /start → mostra os planos
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const texto = `
🔥 ⤴️ Veja no vídeo como é o VIP por dentro.

✔️ CloseFriends    ✔️Lives Exclusivas
✔️OnlyFans           ✔️XVideosRED
✔️ Privacy             ✔️Fansly
✔️INC3STOS         ✔️Lives caseiros 


✅ +900 MIL mídias disponíveis
✅ +1.500 modelos catalogadas
✅ Downloads liberados
✅ Atualização diária de conteúdo


🎁 𝘽𝙊̂𝙉𝙐𝙎  𝙀𝙎𝙋𝙀𝘾𝙄𝘼𝙇:

🌶 Grupo de Filmes Premium
🌶10 grupos SECRETOS
🌶 Filmes de CAMERA escondida
`;

  const opcoes = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Acessar GRUPO VIP", callback_data: "mostrar_planos" },
          // { text: "✅ Acessar GRUPO VIP", callback_data: "sim_bonus" },
          // { text: "❌ Não quero bônus", callback_data: "nao_bonus" }
        ]
      ]
    },
    parse_mode: "Markdown"
  };


  await bot.sendVideo(chatId, 'https://drive.google.com/uc?export=download&id=19_rGjuwIlW1pbCV9FoV0ckwpPKF63Ybe');
  bot.sendMessage(chatId, '👋 Olá, seja bem vindo ao *Vazados* *Quentes* 🌶', {
    parse_mode: "Markdown"
  })
  bot.sendMessage(chatId, texto, opcoes);
});

// 🎯 Quando clica nos botões de bônus
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "nao_bonus") {
    return bot.sendMessage(chatId, "❌ Ok, bônus não adicionado.");
  }

  if (data === "plano_vitalicio") {
    const valor = 19.99;
    const valorCentavos = Math.round(valor * 100);
    bot.sendMessage(chatId, "💰 Gerando pagamento PIX para o seu plano...");
    console.log(valorCentavos)

    const pagamento = await criarPagamento(valorCentavos);
    // console.log(pagamento)

    if (pagamento.pix) {
      const codigoPix = pagamento.pix.qrcode;
      const qrImage = pagamento.pix.qrcode;

      const msgPlano = `
✨ *Você selecionou o seguinte plano:*
🧾 *Plano:* VITALÍCIO + BÔNUS 🎁 + VIP BLACK  
💰 *Valor:* R$${valor.toFixed(2)}

💸 *Pague via Pix Copia e Cola* (ou QR Code em qualquer banco):

\`\`\`
${codigoPix}
\`\`\`

🔸 Toque no código acima para copiar.  
⚠️ Após o pagamento, clique em um dos botões abaixo:
`;

      const botoes = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Verificar Status do Pagamento", callback_data: `status_${pagamento.id}` }],
            [{ text: "📷 Mostrar QR Code", callback_data: `qrcode_${pagamento.id}` }]
          ]
        },
        parse_mode: "Markdown"
      };

      await bot.sendMessage(chatId, msgPlano, botoes);
    } else {
      bot.sendMessage(chatId, "⚠️ Erro ao gerar pagamento PIX.");
    }
  }

    if (data === "plano_vip1mes") {
    const valor = 14.99;
    const valorCentavos = Math.round(valor * 100);
    bot.sendMessage(chatId, "💰 Gerando pagamento PIX para o seu plano...");
    console.log(valorCentavos)

    const pagamento = await criarPagamento(valorCentavos);
    // console.log(pagamento)

    if (pagamento.pix) {
      const codigoPix = pagamento.pix.qrcode;
      const qrImage = pagamento.pix.qrcode;

      const msgPlano = `
✨ *Você selecionou o seguinte plano:*
🧾 *Plano:* VITALÍCIO + BÔNUS 🎁 + VIP BLACK  
💰 *Valor:* R$${valor.toFixed(2)}

💸 *Pague via Pix Copia e Cola* (ou QR Code em qualquer banco):

\`\`\`
${codigoPix}
\`\`\`

🔸 Toque no código acima para copiar.  
⚠️ Após o pagamento, clique em um dos botões abaixo:
`;

      const botoes = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Verificar Status do Pagamento", callback_data: `status_${pagamento.id}` }],
            [{ text: "📷 Mostrar QR Code", callback_data: `qrcode_${pagamento.id}` }]
          ]
        },
        parse_mode: "Markdown"
      };

      await bot.sendMessage(chatId, msgPlano, botoes);
    } else {
      bot.sendMessage(chatId, "⚠️ Erro ao gerar pagamento PIX.");
    }
  }

  if (data === "mostrar_planos") {

    const texto = 'Selecione o plano abaixo:';

    const opcoes = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '😈 VITALÍCIO + BÔNUS 🎁 — R$19,99', callback_data: 'plano_vitalicio' }
          ],
          [
            { text: '🔥 VIP 1 MÊS — R$14,99', callback_data: 'plano_vip1mes' }
          ]
        ]
      }
    };

    bot.sendMessage(chatId, texto, opcoes);

  }

  // 🧾 Verificar status
  if (data.startsWith("status_")) {
    const id = data.split("_")[1];
    const response = await fetch(`https://api.blackcatpagamentos.com/v1/transactions/${id}`, {
      headers: { Authorization: auth }
    });
    const info = await response.json();

    let statusMsg = "⌛ Aguardando pagamento...";
    if (info.status === "approved") {
      statusMsg = "✅ Pagamento confirmado!";
      bot.sendMessage(chatId, "🎉 Obrigado pelo pagamento! Você já pode acessar o grupo VIP.");
      bot.sendMessage(chatId, "🔞 Link do grupo VIP: https://t.me/+VIPBlack2024");
    }
    else if (info.status === "cancelled") statusMsg = "❌ Pagamento cancelado.";

    await bot.sendMessage(chatId, `📊 *Status do pagamento:* ${statusMsg}`, { parse_mode: "Markdown" });
  }

  // 📷 Mostrar QR Code
  if (data.startsWith("qrcode_")) {

    const id = data.split("_")[1];
    const response = await fetch(`https://api.blackcatpagamentos.com/v1/transactions/${id}`, {
      headers: { Authorization: auth }
    });
    const info = await response.json();

    const payload = info?.pix?.qrcode; // código do Pix copia e cola

    // 2. Gerar imagem QR Code e salvar
    const filePath = `./qrcode-${chatId}.png`;
    await qrcode.toFile(filePath, payload, { width: 300 });

    // 3. Enviar a imagem do QR Code no Telegram
    await bot.sendPhoto(chatId, filePath, {
      caption: `💸 *Escaneie o QR Code para pagar via Pix*\n\nOu copie o código:\n\`\`\`\n${payload}\n\`\`\``,
      parse_mode: 'Markdown'
    });

    // 4. (Opcional) Remover o arquivo local após enviar
    fs.unlinkSync(filePath);

  }
});




async function PayWithPix() {
  try {
    const url = 'https://api.blackcatpagamentos.com/v1/transactions';
    const publicKey = 'pk_2muW-gXa0vYdqRPvcbvajbT5ZUvQsZSE4VxV3b7L9uhsBvEm';
    const secretKey = 'sk_TQ9iupHFAWeqxtqqC6fKxX5t7aYzh62pH_QZbChMMb8Nb2TU';
    const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

    const payload = {
      pix: { expiresInDays: 2 },
      items: [{ tangible: false, quantity: 1, unitPrice: 1000, title: 'teste' }],
      customer: {
        document: { type: 'cpf', number: '333333333' },
        name: 'MUTONE SEBA',
        email: 'kmknaboa8@gmail.com',
        phone: '874335217'
      },
      amount: 1000,
      paymentMethod: 'pix',
      currency: 'BRL'
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

// PayWithPix()