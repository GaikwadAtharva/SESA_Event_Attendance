# SESA Event Attendance Tracker

A web-based **Event Attendance Tracker** developed as a technical task for the **Software Engineering Students Association (SESA)** Technical Team selection.

The application allows students to register for an event and provides organizers with a secure interface to search participants, verify registrations, mark attendance, and monitor attendance statistics through a dashboard.

---

## 🚀 Live Demo

**Live Application:**  
https://sesa-event-attendance.onrender.com

**GitHub Repository:**  
https://github.com/GaikwadAtharva/SESA_Event_Attendance

---

## 📌 Overview

Managing attendance manually at college events can be time-consuming and error-prone. This project provides a simple digital solution where:

1. Students register for an event using their details.
2. Their registration is stored in a database.
3. Organizers can search for registered participants at the entrance.
4. The organizer can verify the participant's details.
5. Attendance can be marked as **Present**.
6. Attendance remains stored even after refreshing the page.
7. A dashboard displays overall attendance statistics.

The project focuses on building a **simple, reliable, and easy-to-understand system** rather than adding unnecessary complexity.

---

# ✨ Features

## 👨‍🎓 Participant Registration

Students can register for an event by providing:

- Full Name
- College ID
- Email Address
- Contact Number

The system validates the registration and prevents duplicate registrations using the College ID.

---

## 🔎 Participant Search

Organizers can search registered participants using:

- Name
- Email
- College ID
- Contact Number

This makes it easier to find a participant quickly during event entry.

---

## ✅ Attendance Management

The organizer can:

- Search for a registered participant.
- View participant details.
- Check their current attendance status.
- Mark the participant as **Present**.
- Prevent attendance from being accidentally marked multiple times.

If a participant is not registered, the system clearly indicates that no matching registered participant was found.

---

## 📊 Attendance Dashboard

The organizer dashboard displays:

- Total Registered
- Total Present
- Total Absent / Not Yet Marked
- Attendance Percentage

The statistics are updated after attendance is marked.

---

## 🔐 Organizer Authentication

The organizer dashboard is protected by a login system.

Organizer credentials are configured through environment variables instead of being hard-coded into the source code.

The application uses Flask sessions to maintain the organizer's login state.

---

# 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Web framework |
| SQLite | Database |
| HTML | Page structure |
| CSS | User interface and styling |
| JavaScript | Dynamic functionality and API interaction |
| Gunicorn | Production WSGI server |
| Render | Cloud deployment |
| GitHub | Source code management |

---

# 🏗️ Application Architecture

The application follows a simple web application architecture:

```text
                 ┌──────────────────────┐
                 │      Student         │
                 │   Registration UI     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │      Flask App       │
                 │      (Backend)       │
                 └──────────┬───────────┘
                            │
                 ┌──────────┴───────────┐
                 │                      │
                 ▼                      ▼
        ┌─────────────────┐    ┌─────────────────┐
        │   SQLite DB     │    │ Organizer Panel │
        │                 │    │                 │
        │ Events          │    │ Search          │
        │ Participants    │    │ Attendance      │
        │ Attendance      │    │ Dashboard       │
        │ Organizers      │    │                 │
        └─────────────────┘    └─────────────────┘
```

---

# 📂 Project Structure

```text
SESA_Event_Attendance/
│
├── app.py
├── database.py
├── requirements.txt
├── .gitignore
│
├── templates/
│   ├── index.html
│   └── organizer.html
│
└── static/
    ├── style.css
    ├── script.js
    └── organizer.js
```

### File Description

**app.py**

Contains the Flask application, routes, authentication, registration handling, participant APIs, attendance management, and dashboard APIs.

**database.py**

Handles SQLite database initialization, table creation, and database-related operations.

**index.html**

Student-facing registration page.

**organizer.html**

Organizer login/dashboard interface.

**style.css**

Contains the application's visual styling and responsive interface.

**script.js**

Handles student registration and frontend interactions.

**organizer.js**

Handles organizer search, participant display, attendance marking, and dashboard updates.

**requirements.txt**

Contains the Python dependencies required to run the application.

---

# 🗄️ Database Design

The application uses **SQLite** for persistent data storage.

The main tables are:

### Events

Stores event information.

Example fields:

```text
id
name
description
date
```

### Participants

Stores registered student information.

Example fields:

```text
id
name
college_id
email
contact
```

### Attendance

Connects participants with events and stores their attendance status.

Example fields:

```text
id
event_id
participant_id
status
registration_token
```

### Organizers

Stores organizer authentication information.

Example fields:

```text
id
username
password_hash
```

---

# 🔄 Application Workflow

## Student Registration

```text
Student
   ↓
Opens Registration Page
   ↓
Enters Details
   ↓
Flask Backend Validates Data
   ↓
Checks College ID
   ↓
Creates Participant
   ↓
Creates Attendance Record
   ↓
Registration Successful
```

---

## Organizer Attendance

```text
Organizer Login
      ↓
Organizer Dashboard
      ↓
Search Participant
      ↓
Participant Found?
   ↙           ↘
 Yes            No
  ↓              ↓
Show Details    Show Not Found
  ↓
Check Status
  ↓
Mark Present
  ↓
Database Updated
  ↓
Dashboard Statistics Updated
```

---

# 🔎 Search and Verification

At the entrance of an event, organizers can search for a participant using information such as:

- Name
- Email
- College ID
- Contact Number

The application searches the registered participant list.

If a match is found, the participant's information and current attendance status are displayed.

If there is no matching registered participant, the organizer receives a clear **not found** indication.

This helps prevent unregistered students from being incorrectly marked as attendees.

---

# ✅ Attendance Persistence

Attendance is stored in the SQLite database rather than only in browser memory.

Therefore:

- Refreshing the page does not reset attendance.
- Present participants remain Present.
- Participants who have not been marked remain Absent / Not Yet Marked.
- Dashboard statistics are calculated from the stored attendance records.

This ensures that attendance remains reliable throughout the event.

---

# 📊 Dashboard Calculation

The dashboard calculates attendance using the stored attendance records.

### Attendance Percentage

```text
Attendance Percentage =
(Total Present / Total Registered) × 100
```

For example:

```text
Registered = 5
Present = 3
Absent = 2

Attendance Percentage = (3 / 5) × 100
                       = 60%
```

---

# 🔐 Organizer Authentication & Security

Organizer access is protected through a login system.

Credentials are configured using environment variables:

```text
ORGANIZER_USERNAME
ORGANIZER_PASSWORD
FLASK_SECRET_KEY
```

The organizer password is stored using a password hash rather than storing the plain-text password directly in the database.

The organizer routes also require an authenticated session.

Sensitive credentials are therefore not committed to GitHub.

---

# ⚙️ Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/GaikwadAtharva/SESA_Event_Attendance.git
```

Move into the project directory:

```bash
cd SESA_Event_Attendance
```

---

## 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Set the following environment variables:

```text
ORGANIZER_USERNAME=sesa_admin
ORGANIZER_PASSWORD=your_secure_password
FLASK_SECRET_KEY=your_secret_key
```

The actual password and secret key should not be committed to GitHub.

---

## 5. Run the Application

```bash
python app.py
```

The application will start locally and can be accessed through the Flask development server.

---

# ☁️ Deployment

The application is deployed using **Render**.

### Deployment Configuration

```text
Runtime:
Python 3

Build Command:
pip install -r requirements.txt

Start Command:
gunicorn app:app

Branch:
main
```

Environment variables are configured through Render's environment-variable settings.

The SQLite database is created automatically when the application starts.

---

# 🧪 Testing

The application was tested using sample participant data.

| Name | College ID | Email | Contact |
|---|---|---|---|
| Aarav Sharma | MIT001 | aarav.sharma@example.com | 9000000001 |
| Riya Patil | MIT002 | riya.patil@example.com | 9000000002 |
| Aditya Kulkarni | MIT003 | aditya.kulkarni@example.com | 9000000003 |
| Sneha Joshi | MIT004 | sneha.joshi@example.com | 9000000004 |
| Rahul Deshmukh | MIT005 | rahul.deshmukh@example.com | 9000000005 |

A test scenario with:

```text
Total Registered = 5
Total Present = 3
Total Absent = 2
```

should result in:

```text
Attendance Percentage = 60%
```

---

# 🧩 Technical Challenge

One of the important technical challenges was ensuring that attendance remains persistent after refreshing the application.

A frontend-only solution would lose attendance information when the page was refreshed.

To solve this, attendance was stored in SQLite and connected to the corresponding event and participant.

Whenever attendance is marked:

```text
Organizer
   ↓
Frontend Request
   ↓
Flask API
   ↓
SQLite Database
   ↓
Attendance Status Updated
```

The dashboard then reads the latest information from the database.

This approach makes the attendance system more reliable than storing the state only in JavaScript.

---

# 💡 Design Decisions

### Why Flask?

Flask was selected because:

- It is lightweight.
- It is easy to understand.
- It is suitable for a small web application.
- It allows clear separation between frontend and backend.
- It provides simple routing and session support.

### Why SQLite?

SQLite was selected because:

- No separate database server is required.
- It is easy to configure.
- It provides persistent storage.
- It is suitable for a small event attendance system.

### Why Vanilla JavaScript?

JavaScript was used without a frontend framework because the project does not require the additional complexity of React or another framework.

This keeps the application lightweight and easier to understand.

---

# 📋 Assumptions

The project makes the following assumptions:

1. Each event has a defined list of registered participants.
2. College ID is treated as the primary identifier for preventing duplicate registration.
3. Only authenticated organizers can access attendance management.
4. A participant who has not yet been marked Present is considered Absent / Not Yet Marked.
5. The application is intended for college-level events with a manageable number of participants.
6. Organizer credentials are supplied through environment variables.
7. SQLite is sufficient for the expected scale of the technical task.

---

# 📝 Requirement Mapping

The implementation addresses the requirements of the SESA Technical Team task:

| Requirement | Implementation |
|---|---|
| Registration data | Name, College ID, Email, Contact |
| Participant list | Organizer participant list |
| Search by name | Implemented |
| Search by email | Implemented |
| Search by contact | Implemented |
| College ID handling | Duplicate/registration validation |
| Attendance marking | Present status |
| Not registered handling | Clear not-found result |
| Attendance persistence | SQLite database |
| Present vs Absent | Stored attendance status |
| Dashboard | Registered, Present, Absent, Percentage |
| Organizer authentication | Login + session |
| Deployment | Render |
| Source code | GitHub |

---

# 🚀 Future Improvements

Possible improvements for a production-level version include:

- QR-code based registration verification
- QR-code based attendance
- CSV import/export
- Multiple organizer accounts
- Role-based access control
- Event creation from the organizer dashboard
- Year-wise attendance statistics
- Branch-wise attendance statistics
- Attendance reports
- Database migration to PostgreSQL for larger deployments
- Improved audit logging
- Email confirmation after registration

These features were intentionally not added to the current version to keep the project focused on the core requirements.

---

# 🎥 Demo

**Live Demo:**  
https://sesa-event-attendance.onrender.com

**Source Code:**  
https://github.com/GaikwadAtharva/SESA_Event_Attendance

A screen recording can also be provided as part of the SESA technical task submission.

---

# 👨‍💻 Author

**Atharva Gaikwad**

B.Tech — Computer Science (Software Engineering)

MIT Academy of Engineering

---

# 🎯 Project Purpose

This project was developed as part of the **SESA Software Engineering Students Association Technical Team Selection Task**.

The primary goal was to demonstrate:

- Problem-solving ability
- Practical software development
- Backend and frontend integration
- Database design
- Data persistence
- Authentication
- API development
- Deployment
- Understanding of real-world requirements

The implementation prioritizes **functionality, reliability, simplicity, and maintainability** over unnecessary complexity.
