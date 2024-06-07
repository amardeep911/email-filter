import React from "react";

interface CardProps {
  title: string;
  body: string;
  tag: string;
}

const Card = ({ title, body, tag }: CardProps) => {
  return (
    <div className="flex flex-col border-2 border-black mb-2 p-2">
      <div className="flex justify-between ">
        <div className="text-red-600">{title}</div>
        <div className="text-blue-600">{tag}</div>
      </div>
      <div>{body}</div>
    </div>
  );
};

export default Card;
