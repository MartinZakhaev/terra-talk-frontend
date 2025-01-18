import Image from "next/image";

interface ChatBubbleProps {
  avatar: string;
  username: string;
  timestamp: string;
  message: string;
  isSender: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  avatar,
  username,
  timestamp,
  message,
  isSender,
}) => {
  return (
    <div className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image
            alt={`${username}'s avatar`}
            width="40"
            height="40"
            src={avatar}
          />
        </div>
      </div>
      <div className="chat-header">
        {username}
        <time className="text-xs opacity-50 ml-2">{timestamp}</time>
      </div>
      <div className="chat-bubble">{message}</div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
};
