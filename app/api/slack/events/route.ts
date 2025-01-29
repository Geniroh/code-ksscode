// import { NextRequest, NextResponse } from "next/server";

// const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN; // Set in .env.local
// const SLACK_OPEN_VIEW_URL = "https://slack.com/api/views.open";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const trigger_id = formData.get("trigger_id");

//   if (!trigger_id) {
//     return NextResponse.json({ error: "Missing trigger_id" }, { status: 400 });
//   }

//   // Open Slack Modal (form)
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
//   return NextResponse.json(result);
// }

import { NextRequest, NextResponse } from "next/server";

const FORM_URL = "https://yourdomain.com/knowledge-session-form"; // Your form page

export async function POST(req: NextRequest) {
  const body = await req.text(); // Read raw request body
  const params = new URLSearchParams(body); // Parse form data
  const user_id = params.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "User ID not found" }, { status: 400 });
  }

  return NextResponse.json({
    response_type: "ephemeral",
    text: `Click the link below to create a knowledge-sharing session:\n👉 <${FORM_URL}|Open Form>`,
  });
}
