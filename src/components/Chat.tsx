import ChatRoom from "./ChatRoom"
import Chats from "./Chats"

export interface ChatProps {
    userDetails: {
        displayName: string,
        id: string
    }
}

function Chat(props: ChatProps) {
    return (
        <div className="flex">
            <Chats />
            <ChatRoom uid={props.userDetails.id} displayName={props.userDetails.displayName} room="general"/>
        </div>
    )
}

export default Chat
