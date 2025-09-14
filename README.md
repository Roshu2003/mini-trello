
# Taskify (Trello)
Project Overview
================

The project is a **collaborative task and project management platform** inspired by tools like Trello. It is built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** and provides an intuitive interface for teams to organize projects into **workspaces, boards, lists, and cards**.

The platform incorporates essential productivity features such as **card management, labels, assignees, search, and workspaces**, making it a versatile tool for individuals and organizations to manage tasks efficiently.

Workspace & Board Management
----------------------------

*   Users can create multiple **workspaces** to represent teams or departments.
    
*   Each workspace can contain multiple **boards** that represent projects.
    
*   Boards have customizable **backgrounds (color or image)** for better visual organization.
    
*   Boards can be **deleted** or **updated** dynamically, with changes reflected instantly in the UI.
    

Card Management
---------------

*   Boards contain **lists**, and lists hold **cards**.
    
*   Cards represent tasks and support features such as:
    
    *   **Labels** (e.g., bug, feature, urgent)
        
    *   **Assignees** (users assigned to tasks)
        
    *   **Due dates** and **descriptions**
        
*   Cards can be **created, updated, searched, and deleted** easily.
    
*   A dedicated **Card component** improves reusability across the platform.
    

Search Functionality
--------------------

The platform includes a **search system** to quickly find cards within a board by:

*   **Title**
    
*   **Labels**
    
*   **Assignees**


Authentication & Authorization
------------------------------

*   The platform uses **JWT-based authentication** to secure endpoints.
    
*   **Role-based access control** ensures that only authorized users can:
    
    *   Create or delete boards
        
    *   Manage workspaces
        
    *   Update cards and lists
        
*   Context-aware validation can be added for more secure user handling.
    

User Roles
----------

There are three key user roles within the system:

1.  **Admin** – Manages workspaces, boards, and oversees overall usage.
    
2.  **Members** – Can create/update/delete cards within workspaces they belong to.
    
3.  **Viewers** – Limited role with read-only access to boards and cards.
    

Features
--------
✅ Create, update, and delete Workspaces & Boards.  
✅ Manage Lists and Cards (with labels, assignees, and due dates).  
✅ Search cards by title, labels, or assignees.  
✅ JWT Authentication and role-based access.  
✅ Background customization for boards (color/image).  
✅ Real-time UI updates on create/delete actions.  

## Technologies  

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT Authentication, Role-based access 
- **Other:** Axios, Dotenv  

### Entity Relationship Diagram

- **workspaces**
  - id (string, pk)
  - name (string)
  - owner (string)
  - members (string)

- **users**
  - id (string, pk)
  - name (string)
  - email (string)
  - password (string)
  - role (string)

- **boards**
  - id (string, pk)
  - workspaceId (string)
  - title (string)
  - description (string)
  - owner (string)

- **lists**
  - id (string, pk)
  - boardId (string)
  - title (string)
  - position (number)

- **cards**
  - id (string, pk)
  - listId (string)
  - boardId (string)
  - title (string)
  - description (string)
  - labels (string)
  - dueDate (date)
  - assignees (string)

- **activities**
  - id (string, pk)
  - boardId (string)
  - action (string)
  - payload (string)
  - userId (string)
  - createdAt (date)

- **comments**
  - id (string, pk)
  - cardId (string)
  - userId (string)
  - text (string)

## Schema Diagram
![Schema Diagram](https://github.com/Roshu2003/mini-trello/blob/main/Schema%20Diagram.jpg?raw=true)

# 🚀 Getting Started

## 📌 Prerequisites
Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 16.x recommended)  
- [MongoDB](https://www.mongodb.com/) installed locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) account  
- [Git](https://git-scm.com/) for cloning the repository  

---
## 📦 Installation

### 1️⃣ Clone the Repository
```bash
https://github.com/Roshu2003/mini-trello.git
cd mini-trello
```
### 2️⃣ Install dependencies
### Server:
```bash
cd Server
npm install
```
### Client:
```bash
cd ../Client
npm install
```
### 3️⃣ Set up Environment Variables
```bash
PORT=4000
MONGO_URI="Put Your URL"
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```
### 4️⃣ Run the Project
### Server:
```bash
cd ../Server
npm run dev
```
### Client:
```bash
cd ../Client
npm run dev
```

### 5️⃣ Notes
*   Make sure **Node.js >= 18** and **npm >= 9** are installed.
    
*   Ensure MongoDB is running locally or update MONGO\_URI to your cloud database.

# Architecture
*   1\. **Authentication & Security**
    
*   **Scenario:** User login, logout, and session management.
    
*   **Special Handling:**
    
    *   Use JWT tokens and store securely (HTTP-only cookies or localStorage with precautions).
        
    *   Validate context-based factors (IP, device, location) for suspicious logins.
        
    *   Notify users for unusual activity.
        
    *   Passwords must always be hashed (bcrypt) and sensitive info encrypted (AES for device info).
        
*   2\. **Board & Workspace Management**
    
*   **Scenario:** Creating, updating, or deleting boards/workspaces.
    
*   **Special Handling:**
    
    *   Role-based access: Only owners can delete or edit boards/workspaces.
        
    *   Ensure frontend state updates immediately after API responses.
        
    *   Handle concurrent updates (e.g., two users editing board titles simultaneously) — could require optimistic updates or locks.
        
*   3\. **Card Operations**
    
*   **Scenario:** Creating, updating, moving, deleting, or assigning cards.
    
*   **Special Handling:**
    
    *   Drag-and-drop operations: Update position in the database carefully to maintain ordering.
        
    *   Moving cards across lists or boards must log activity for history.
        
    *   Deleting a card should cascade or update related entities properly.
        
    *   Real-time updates if multiple users are viewing the same board (WebSocket/Socket.IO).
        
*   4\. **Member Invitations & Roles**
    
*   **Scenario:** Inviting members to workspaces/boards.
    
*   **Special Handling:**
    
    *   Ensure invitations are validated (email format, user existence, workspace permissions).
        
    *   Prevent duplicate invites.
        
    *   Update workspace/board state immediately after acceptance.
        
*   5\. **Search & Filtering**
    
*   **Scenario:** Searching for cards by title, labels, or assignees.
    
*   **Special Handling:**
    
    *   Optimize database queries with indexes for frequent search fields.
        
    *   Handle partial matches, case-insensitive search.
        
    *   Return paginated results if the dataset is large.
        
*   6\. **Activity Logging**
    
*   **Scenario:** Any CRUD operation on boards, lists, cards.
    
*   **Special Handling:**
    
    *   Always log user, board, action, and payload.
        
    *   Activity should be consistent with state changes; consider transactions for critical operations.
        
    *   Handle high traffic — logging shouldn’t slow down the main operation.
        
*   7\. **Real-Time Collaboration**
    
*   **Scenario:** Multiple users viewing the same board simultaneously.
    
*   **Special Handling:**
    
    *   Use WebSockets or Socket.IO for broadcasting updates like card moves, additions, deletions.
        
    *   Ensure updates are idempotent to avoid conflicting states.
        
    *   Handle reconnection gracefully for dropped connections.
        
*   8\. **Error Handling & Data Integrity**
    
*   **Scenario:** Network errors, invalid data, or database failures.
    
*   **Special Handling:**
    
    *   Use centralized error handling in backend.
        
    *   Validate all inputs (title length, required fields, email format).
        
    *   Provide meaningful frontend messages without exposing sensitive info.
        
    *   Ensure transactional safety where multiple related updates occur.
        
*   💡 **Summary of Prioritization:**
    
*   Authentication & user security
    
*   Board/workspace access control
    
*   Card operations (CRUD & real-time updates)
    
*   Member management & invites
    
*   Search & filtering performance
    
*   Activity logging for history
    
*   Error handling & data integrity

# HLD
![Architecture](https://github.com/Roshu2003/mini-trello/blob/main/HLD%20Trello.png?raw=true)

