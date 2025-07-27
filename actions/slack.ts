import { format12HTime } from "@/lib/utils";
import axios from "axios";

const clientUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://code-ksscode.vercel.app";

type SlackSessionNotificationParams = {
  title: string;
  description?: string | null;
  date: string | Date;
  startTime: string;
  endTime: string;
  creator: string;
  guests?: string[];
};

export async function sendSlackSessionNotification({
  title,
  date,
  startTime,
  endTime,
  creator,
}: SlackSessionNotificationParams) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Slack webhook URL not configured");
  }

  const formattedDate = new Date(date).toLocaleDateString();

  const payload = {
    text: " 🎯 New Knowledge sharing session",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎯 New Knowledge sharing session",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Title:*\n ${title}`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Date:*\n ${formattedDate}`,
          },
          {
            type: "mrkdwn",
            text: `*When:*\n${format12HTime(startTime)} - ${format12HTime(
              endTime
            )}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*creator:*\n ${creator}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${clientUrl}/dashboard/view-session|View request>`,
        },
      },
    ],
  };

  try {
    const { data } = await axios.post(webhookUrl, payload);

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

type SlackSuggestionNotificationParams = {
  title: string;
  creator: string;
  suggestionId: string;
};

export async function sendSlackSuggestionNotification({
  title,
  creator,
  suggestionId,
}: SlackSuggestionNotificationParams) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Slack webhook URL not configured");
  }

  const payload = {
    text: " 📝 Kss Suggestion",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📝 Kss Suggestion",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Title:*\n ${title}`,
          },
          {
            type: "mrkdwn",
            text: `*Suggested by:*\n ${creator}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${clientUrl}/dashboard/suggestion/${suggestionId}|Handle Session>`,
        },
      },
    ],
  };

  try {
    const { data } = await axios.post(webhookUrl, payload);

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

type SlackQuestionNotificationParams = {
  title: string;
  creator: string;
  questionId: string;
};

export async function sendSlackQuestionNotification({
  title,
  creator,
  questionId,
}: SlackQuestionNotificationParams) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Slack webhook URL not configured");
  }

  const payload = {
    text: "📝❔ Help Requested",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📝❔ Help Requested",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Title:*\n ${title}`,
          },
          {
            type: "mrkdwn",
            text: `*Asked by:*\n ${creator}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${clientUrl}/question/${questionId}|Help out>`,
        },
      },
    ],
  };

  try {
    const { data } = await axios.post(webhookUrl, payload);

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
