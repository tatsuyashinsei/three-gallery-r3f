import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          {/* 掲示板リンク */}
          <div className="p-4 border-b border-base-300">
            <Link 
              to="/board" 
              className="btn btn-outline btn-sm gap-2 hover:btn-primary transition-colors"
            >
              <MessageCircle size={16} />
              掲示板
            </Link>
          </div>
          
          <div className="flex h-[calc(100%-4rem)] rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
