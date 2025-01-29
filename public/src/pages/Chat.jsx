
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { allUsersRoute, host } from '../utils/APIRoutes';
import axios from 'axios';
import Contacts from '../components/Contact';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch user from localStorage and ensure valid JSON
    useEffect(() => {
        async function setUser() {
            const userData = localStorage.getItem("chat-app-user");
            if (!userData) {
                navigate("/login");
                return;
            }
            try {
                setCurrentUser(JSON.parse(userData));
                setIsLoaded(true);
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem("chat-app-user");
                navigate("/login");
            }
        }
        setUser();
    }, [navigate]);

    // Connect socket after currentUser is set
    useEffect(() => {
        if (currentUser && currentUser._id) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    // Fetch contacts after currentUser is set
    useEffect(() => {
        async function fetchData() {
            if (!currentUser) return;
            if (!currentUser.isAvatarImageSet) {
                navigate("/setAvatar");
                return;
            }
            try {
                const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        }
        fetchData();
    }, [currentUser, navigate]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <Container>
            <div className='container'>
                <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
                {isLoaded && currentChat === undefined ? (
                    <Welcome currentUser={currentUser} />
                ) : (
                    <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                )}
            </div>
        </Container>
    );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
