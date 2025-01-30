// import { NextRequest, NextResponse } from "next/server";

// const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
// const SLACK_OPEN_VIEW_URL = "https://slack.com/api/views.open";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const trigger_id = formData.get("trigger_id") || "test";

//   console.log({ formData });

//   if (!trigger_id) {
//     return NextResponse.json({ error: "Missing trigger_id" }, { status: 400 });
//   }

//   const response = await fetch(SLACK_OPEN_VIEW_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
//     },
//     body: JSON.stringify({
//       trigger_id,
//       view: {
//         type: "modal",
//         callback_id: "knowledge_session_form",
//         title: { type: "plain_text", text: "Create Knowledge Session" },
//         submit: { type: "plain_text", text: "Submit" },
//         close: { type: "plain_text", text: "Cancel" },
//         blocks: [
//           {
//             type: "input",
//             block_id: "title_block",
//             label: { type: "plain_text", text: "Session Title" },
//             element: { type: "plain_text_input", action_id: "title" },
//           },
//           {
//             type: "input",
//             block_id: "date_block",
//             label: { type: "plain_text", text: "Session Date" },
//             element: {
//               type: "plain_text_input",
//               action_id: "date",
//               placeholder: { type: "plain_text", text: "YYYY-MM-DD" },
//             },
//           },
//           {
//             type: "input",
//             block_id: "desc_block",
//             label: { type: "plain_text", text: "Description" },
//             element: {
//               type: "plain_text_input",
//               action_id: "description",
//               multiline: true,
//             },
//           },
//         ],
//       },
//     }),
//   });

//   const result = await response.json();
//   console.log({ result });
//   return NextResponse.json(result);
// }

import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://code-ksscode.vercel.app";

const CREATE_SESSION_URL = `${BASE_URL}/dashboard/book-session`;
const UPCOMING_SESSIONS_URL = `${BASE_URL}/dashboard/view-session`;
const SUGGESTION_URL = `${BASE_URL}/dashboard/make-suggestion`;
const HELP_URL = `${BASE_URL}/dashboard/ask-question`;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const user_id = params.get("user_id");

  console.log({ params });

  if (!user_id) {
    return NextResponse.json({ error: "User ID not found" }, { status: 400 });
  }

  return NextResponse.json({
    response_type: "ephemeral",
    text: `:bulb: *Knowledge Sharing Commands* :bulb:\n\n
- 📅 *Create a session:* <${CREATE_SESSION_URL}|Click here>\n
- 📖 *View upcoming sessions:* <${UPCOMING_SESSIONS_URL}|Click here>\n
- 💡 *Make a suggestion:* <${SUGGESTION_URL}|Click here>\n
- ❓ *Need help?* <${HELP_URL}|Click here>`,
  });
}
