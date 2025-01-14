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
    <>
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image
              alt="Tailwind CSS chat bubble component"
              width="40"
              height="40"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <div className="chat-header">
          Obi-Wan Kenobi
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble">You were the Chosen One!</div>
        <div className="chat-footer opacity-50">Delivered</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image
              alt="Tailwind CSS chat bubble component"
              width="40"
              height="40"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div>
    </>
  );
};
