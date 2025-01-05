import Image from "next/image";

interface ChatBubbleProps {
  avatar: string;
  username: string;
  timestamp: string;
  message: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  avatar,
  username,
  timestamp,
  message,
}) => {
  return (
    <div className="flex m-4 items-center gap-4 p-4 bg-primary-foreground rounded-lg shadow-md">
      <Image
        src={avatar}
        alt={`${username}'s avatar`}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {username}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timestamp}
          </span>
        </div>
        <p className="mt-1 text-gray-800 dark:text-gray-200">{message}</p>
      </div>
    </div>
  );
};
