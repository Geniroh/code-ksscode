import Link from "next/link";
import React from "react";
import { X } from "lucide-react";

import { getDeviconClassName } from "@/lib/utils";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconClassName(name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <div className="flex flex-row gap-2 bg-white text-black rounded-md border-none uppercase text-[10px]">
        <div className="flex-center space-x-1">
          <i className={`${iconClass} text-[10px]`}></i>
          <span>{name}</span>
        </div>

        {remove && (
          <X
            width={12}
            height={12}
            className="cursor-pointer"
            onClick={handleRemove}
          />
        )}
      </div>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link href={_id} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }
};

export default TagCard;
