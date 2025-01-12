"use client";

import React from "react";
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Flag } from "lucide-react";

// Mock data for the question and answers
const question = {
  id: "1",
  title: "How do I center a div?",
  content:
    "I'm trying to center a div horizontally and vertically within its parent container. I've tried using margin: auto but it doesn't seem to work. Any suggestions?",
  author: "JohnDoe",
  date: "2025-01-12",
  votes: 10,
  answers: 2,
};

const answers = [
  {
    id: "1",
    content:
      "You can use flexbox to center a div both horizontally and vertically. Here's an example:\n\n```css\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh; /* Adjust as needed */\n}\n```\n\nThis will make the parent a flex container and center its children both horizontally and vertically.",
    author: "CSSMaster",
    date: "2025-01-12",
    votes: 15,
  },
  {
    id: "2",
    content:
      "Another approach is to use CSS Grid:\n\n```css\n.parent {\n  display: grid;\n  place-items: center;\n  height: 100vh; /* Adjust as needed */\n}\n```\n\nThis is a more modern approach and works great for centering items.",
    author: "GridGuru",
    date: "2025-01-13",
    votes: 8,
  },
];

const MenuButton = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <Button
    variant="ghost"
    size="sm"
    className="text-muted-foreground hover:text-foreground"
  >
    <Icon className="mr-2 h-4 w-4" />
    {label}
  </Button>
);

// const TiptapEditor = ({ onSubmit }: { onSubmit: (content: string) => void }) => {
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: '<p>Type your answer here...</p>',
//   })

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Your Answer</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <EditorContent editor={editor} className="min-h-[200px] border rounded-md p-2" />
//       </CardContent>
//       <CardFooter>
//         <Button onClick={() => onSubmit(editor?.getHTML() || '')}>Post Your Answer</Button>
//       </CardFooter>
//     </Card>
//   )
// }

export default function QuestionPage() {
  //   const handleSubmitAnswer = (content: string) => {
  //     console.log('New answer submitted:', content)
  //     // Here you would typically send this to your backend
  //   }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={`https://avatar.vercel.sh/${question.author}`}
                />
                <AvatarFallback>
                  {question.author.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{question.author}</p>
                <p className="text-sm text-muted-foreground">
                  Asked on {question.date}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                {question.votes} votes
              </Button>
              <Button variant="outline" size="sm">
                {question.answers} answers
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{question.content}</p>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              <MenuButton icon={ThumbsUp} label="Vote" />
              <MenuButton icon={Flag} label="Flag" />
            </div>
            <MenuButton icon={MessageSquare} label="Add Comment" />
          </div>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mb-4">{answers.length} Answers</h2>
      {answers.map((answer) => (
        <Card key={answer.id} className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${answer.author}`}
                  />
                  <AvatarFallback>
                    {answer.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{answer.author}</p>
                  <p className="text-sm text-muted-foreground">
                    Answered on {answer.date}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {answer.votes} votes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: answer.content }}
            />
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <div className="flex space-x-2">
                <MenuButton icon={ThumbsUp} label="Vote" />
                <MenuButton icon={Flag} label="Flag" />
              </div>
              <MenuButton icon={MessageSquare} label="Add Comment" />
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* <TiptapEditor onSubmit={handleSubmitAnswer} /> */}
    </div>
  );
}
