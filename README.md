# react-groups-chat-live
### by Shubhrendu Tripathi

This repository contains the frontend application for a Live Chat Messaging System for Groups where users can communicate in groups similar to WhatsApp. 

## Deployed Application (Vercel)

https://react-groups-chat-live.vercel.app/

## Instructions to setup and run the project locally

1. Clone the repository:

    > git clone https://github.com/shubhtr/react-groups-chat-live

2. Navigate to the directory

    > cd react-groups-chat-live

2. Install packages

    > npm i

3. Run the project

    > npm run start

## Architecture and Design Decisions

1. State Management ---> React Context API
    * <ins>chatContext.js</ins> provides global state for messages, groups, and users.
    * <ins>useChat()</ins> hook allows access to chat data in any component.

2. Routing and Navigation ---> React Router
    * <ins>/</ins> ---> Group List
    * <ins>/chat</ins> ---> Chat Room

3. UI Libary ---> Material UI (MUI)
    * <ins>Typography</ins> for text formatting.
    * <ins>Paper</ins> for card-like chat windows.
    * <ins>List</ins> & <ins>ListItem</ins> for groups and messages.
    * <ins>Dialog</ins> for viewing group users.

4. Backend Simulation → MirageJS
    * Fake user data, group memberships, and chat history.
    * Intercepts API calls and returns mock data.

5. Data Persistence → LocalStorage
    * Keeps chat history even after page refresh.
    * Lightweight, no backend required.
    * Messages are stored per group in localStorage (chat_{groupId}).
    * Retrieved when switching between groups.

6. Simulated Real-Time Updates → Polling (setInterval)
    * Simulates new messages from random users.
    * setInterval() polls messages every few seconds.
    * Generates random messages at intervals for simulation.


## Features

1. Group Chat Interface
    * Users can view a list of groups and join any group.
    * A chat interface should display messages in a group with timestamps and sender names.
    * Messages sent by the user should appear distinctly (e.g., aligned to the right).

2. Messaging Features
    * Users can send and view messages in real-time.
    * Show a typing indicator when a user is typing.
    * Allow users to see the number of participants in a group.
    * Real-time updates - Uses a simulated real-time solution (polling) to update messages dynamically.

3. Mock Data Integration
    * User data (e.g., names, group memberships)
    * Group data (e.g., group names, participant lists)
    * Chat history

4. Responsive Design
    * Application works seamlessly on desktops, tablets and mobile devices

5. Error Handling
    * Handles edge cases such as no internet connection or empty message inputs gracefully.


## Technologies

1. Frontend
    * ReactJS

2. Styling
    * Material UI

3. Mock APIs
    * MirageJS

4. Hosting
    * Vercel