import React, { useState, useContext } from 'react';
import { FcSearch } from "react-icons/fc";
import { RxHamburgerMenu } from "react-icons/rx";
import Chats from './Chats';
import avatar from "../assets/avatar-food.png";
import AuthContext from '../contexts/AuthContext';
import FriendContext from '../contexts/FriendContext';
import { FriendType, User } from '../types';

interface Props {
    setFriend: React.Dispatch<React.SetStateAction<User>>;
    friend: User;
    toggleShow: () => void;
}

function Message({ setFriend, friend, toggleShow }: Props) {

    const [text, setText] = useState("");
    const [err, setErr] = useState("");

    const isFriendPictureEmpty = friend?.displayPicture === "";

    const { state } = useContext(AuthContext);
    const { friends, dispatch: friendDispatch } = useContext(FriendContext);

    const { user } = state;
    const currentUser = user as User;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`https://hawky.onrender.com/api/user/` + text);
        const json = await res.json();

        if (!res.ok) {
            setErr(json.error);
            setTimeout(() => setErr(""), 3000);
        }

        if (res.ok) {
            setFriend(json);
            setText(""); // better UX
        }
    };

    const handleAddFriend = async () => {

        const body = {
            userName: currentUser.userName,
            friendUsername: friend.userName,
            friendId: friend._id,
            userId: currentUser.id,
            friendImage: friend.displayPicture
        };

        const res = await fetch(`https://hawky.onrender.com/api/friend/addFriend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser.token}`
            },
            body: JSON.stringify(body)
        });

        const json = await res.json();

        if (!res.ok) {
            setFriend(null!);
            setErr(json.error);
            setTimeout(() => setErr(""), 3000);
        }

        if (res.ok) {
            setFriend(null!);

            const data = {
                _id: json._id,
                friendDetails: json
            };

            friendDispatch({ type: FriendType.ADD, payload: data });
        }
    };

    return (
        <div className='mobile:px-3 px-5 bg-secondary h-[500px] overflow-auto'>
            <div className='sticky top-0 bg-secondary'>

                {/* Header */}
                <div className='mb-6 mt-1 flex justify-between items-center'>
                    <h2 className='text-2xl'>Messages</h2>
                    <RxHamburgerMenu
                        className='mobile:block hidden'
                        onClick={toggleShow}
                        size={23}
                        style={{ cursor: "pointer" }}
                    />
                </div>

                {/* Search */}
                <form onSubmit={handleSearch}>
                    <p className='ml-1'>Find a User</p>

                    {friend && (
                        <div onClick={handleAddFriend} className='flex items-center gap-1 my-2 cursor-pointer'>
                            <img
                                className='w-10 h-10 rounded-full object-cover'
                                src={isFriendPictureEmpty ? avatar : friend?.displayPicture}
                                alt="friend"
                            />
                            <p>{friend?.userName}</p>
                        </div>
                    )}

                    {err && <div className='text-red-500'>{err}</div>}

                    <div className='bg-primary p-3 rounded-2xl flex items-center justify-between'>
                        <input
                            value={text}
                            onChange={e => setText(e.target.value)}
                            type="text"
                            placeholder='Type their username'
                            className='outline-none bg-transparent border-none flex-1'
                        />

                        <button className='bg-secondary rounded-lg p-1 active:scale-90 duration-300 ml-2'>
                            <FcSearch size={20} />
                        </button>
                    </div>
                </form>

            </div>

            {/* Chat list */}
            <div className='flex flex-col gap-5 mt-4'>
                {friends.map(friend => (
                    <Chats key={friend._id} friend={friend} />
                ))}
            </div>
        </div>
    );
}

export default Message;