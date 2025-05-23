import { X, ImageIcon } from "lucide-react"; // アイコン追加
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
// import { useNavigate } from "react-router-dom"; // ← 追加

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  // const navigate = useNavigate(); // ← 追加

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "オンライン" : "失踪中"}
            </p>
          </div>
        </div>

        {/* 右側ボタン群 */}
        <div className="flex items-center gap-2">
          {/* Close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;

// Copied Code.
