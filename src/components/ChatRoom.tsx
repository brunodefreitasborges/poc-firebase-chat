import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Send } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store/store';
import { subscribeToMessages, addMessage } from '../store/slices/messagesSlice';
import React from 'react';

function ChatRoom(props: { room: string; displayName: string; uid: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.messages.messages);
  const loading = useSelector((state: RootState) => state.messages.loading);
  const [newMessage, setNewMessage] = React.useState('');
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(subscribeToMessages(props.room));
  }, [dispatch, props.room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTo({
        top: messageList.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMessage.trim() === '') return;

    dispatch(addMessage({ text: newMessage, uid: props.uid, room: props.room }));
    setNewMessage('');
  };

  return (
    <section className="w-full h-[calc(100vh_-_64px)] flex flex-col pt-5">
      <div     ref={messageListRef} id="message-list" className="w-full h-full bg-background flex flex-col px-2 gap-3 overflow-y-scroll">
        {loading && <p>Loading messages...</p>}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.user === props.displayName
                ? 'w-fit border-[1px] border-blue-500 rounded-md py-2 px-4 gap-2 flex flex-col self-end'
                : 'w-fit border-[1px] border-blue-500 rounded-md py-2 px-4 gap-2 flex flex-col self-start'
            }
          >
            <p className="text-white font-bold">{message.user}</p>
            <p className="text-white text-xs">
            {message.timestamp
        ? new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date(message.timestamp))
        : 'N/A'}
            </p>
            <p className="text-white">{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="m-5">
        <TextField
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          autoComplete="off"
          className="w-full"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton type="submit">
                  <Send className="text-blue-500" />
                </IconButton>
              </InputAdornment>
            ),
            classes: { input: 'text-blue-500 border-blue-500' },
          }}
          variant="outlined"
          name="message"
        />
      </form>
    </section>
  );
}

export default ChatRoom;
