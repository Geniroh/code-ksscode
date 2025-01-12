import Link from "next/link";
import React from "react";

import { getTimeStamp } from "@/lib/utils";

import TagCard from "@/components/card/TagCard";

interface Props {
  question: IQuestionWithTag;
}

const QuestionCard = ({ question: { id, title, tags, createdAt } }: Props) => {
  return (
    <div className="card p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt.toString())}
          </span>

          <Link href={`/questions/${id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags?.map((tag: ITag) => (
          <TagCard key={tag.id} _id={tag.id || ""} name={tag.name} compact />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        {/* <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        /> */}
      </div>
    </div>
  );
};

export default QuestionCard;
