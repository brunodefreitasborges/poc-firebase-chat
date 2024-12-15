// Chats.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchRooms } from '../store/slices/roomsSlice';

function Chats() {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, loading } = useSelector((state: RootState) => state.rooms);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <section className="w-[400px] bg-primary flex flex-col gap-5 py-10 px-5">
      {rooms.map((room) => (
        <h3
          className="text-white hover:cursor-pointer hover:font-bold"
          key={room.id}
        >
          {room.name.toUpperCase()}
        </h3>
      ))}
    </section>
  );
}

export default Chats;
