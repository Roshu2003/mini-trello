
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

