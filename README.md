# SESA Event Attendance Tracker

A web-based **Event Attendance Management System** developed as part of the **Software Engineering Students Association (SESA) Technical Team Selection Task**.

The application allows students to register for events and provides organizers with a secure dashboard to search registered participants, verify their registration, mark attendance, and monitor attendance statistics in real time.

---

## 🌐 Live Demo

**Live Application:**  
https://sesa-event-attendance.onrender.com

**GitHub Repository:**  
https://github.com/GaikwadAtharva/SESA_Event_Attendance

---

# 📌 Application Overview

Managing attendance manually at college events can be time-consuming and error-prone, especially when many students are registered.

This application provides a simple digital workflow:

**Student Registration → Database Storage → Organizer Search → Registration Verification → Attendance Marking → Dashboard Statistics**

The system is designed to be simple, reliable, and easy for organizers to use at an event entrance.

---

# ✨ Key Features

## 👨‍🎓 Student Registration

Students can register for an available event by providing:

- Name
- College ID
- Email
- Contact Number

The system validates the registration and prevents duplicate registration using the College ID.

---

## 🔎 Participant Search

Organizers can search registered participants using:

- Name
- Email
- College ID
- Contact Number

This allows organizers to quickly locate a student's registration at the event entrance.

---

## ✅ Attendance Management

For a registered participant, the organizer can:

- View participant details
- View their current attendance status
- Mark the participant as **Present**

If the participant is not registered, the system clearly displays a **Not Found** result.

Attendance cannot be accidentally marked multiple times for the same participant and event.

---

## 📊 Organizer Dashboard

The dashboard provides real-time attendance statistics:

- Total Registered
- Total Present
- Total Absent
- Attendance Percentage

Example:

```text
Total Registered: 5
Present: 3
Absent: 2
Attendance: 60%
```

---

## 💾 Persistent Attendance

Attendance information is stored in a **PostgreSQL database**.

This means attendance is not dependent on browser memory or temporary frontend state.

The data remains available after:

- Refreshing the page
- Closing the browser
- Reopening the website
- Restarting the web service

---

# 🔐 Organizer Authentication

The Organizer Dashboard is protected by a login system.

Only authenticated organizers can access attendance management features.

## Demo Organizer Credentials

These credentials are provided for project evaluation:

| Field | Value |
|---|---|
| Username | `sesa_admin` |
| Password | `Sesa@2026` |

> **Important:** This is a dedicated demo account created for evaluating this project. It should not be reused for any personal or important account.

---

# 🖥️ How to Use the Website

## 1. Student Registration

1. Open the live application.
2. Select an available event.
3. Enter:
   - Name
   - College ID
   - Email
   - Contact Number
4. Submit the registration form.
5. The registration is stored in the database.

The system prevents duplicate registration using the College ID.

---

## 2. Open the Organizer Dashboard

1. Open the Organizer Login page.
2. Enter:

```text
Username: sesa_admin
Password: Sesa@2026
```

3. Click **Login**.
4. The Organizer Dashboard will open.

---

## 3. View Participants

From the Organizer Dashboard, organizers can view registered participants.

The participant list displays relevant registration information and the current attendance status.

---

## 4. Search for a Student

At the event entrance, an organizer can search using:

- Student Name
- Email
- College ID
- Contact Number

For example:

```text
Search: MIT001
```

If the student is registered, their details will be displayed.

If there is no matching participant, the system clearly indicates that the participant was not found.

---

## 5. Mark Attendance

After finding a registered student:

1. Verify the student's details.
2. Check their current attendance status.
3. Click **Mark Present**.
4. The attendance status is updated.
5. Dashboard statistics are automatically refreshed.

If attendance has already been marked, the system prevents it from being marked again.

---

## 6. Check Dashboard Statistics

The dashboard automatically displays:

```text
Total Registered
Total Present
Total Absent
Attendance Percentage
```

The percentage is calculated using:

```text
Attendance Percentage =
(Total Present / Total Registered) × 100
```

---

## 7. Verify Data Persistence

After marking attendance:

1. Refresh the page.
2. Check the participant's status again.
3. The participant should still show as **Present**.

This verifies that attendance is stored in PostgreSQL rather than only in the browser.

---

# 🧪 Suggested Evaluation Flow

For a quick demonstration of the complete application:

### Step 1
Register several students through the registration page.

### Step 2
Open the Organizer Dashboard using:

```text
Username: sesa_admin
Password: Sesa@2026
```

### Step 3
Search for a registered participant.

### Step 4
Verify their details.

### Step 5
Mark the participant as **Present**.

### Step 6
Repeat the process for a few participants.

### Step 7
Check the dashboard statistics.

### Step 8
Refresh the page and verify that the attendance remains saved.

### Step 9
Search for a student who has not registered and verify the **Not Found** handling.

This demonstrates the complete system workflow:

**Registration → Storage → Search → Verification → Attendance → Dashboard → Persistence**

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Python
- Flask

## Database

- PostgreSQL
- psycopg2

## Authentication & Security

- Flask Sessions
- Werkzeug password hashing

## Deployment

- Render

## Version Control

- Git
- GitHub

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Student       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Registration UI   │
                    │      HTML/CSS/JS     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Flask Backend   │
                    │       app.py        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      database.py    │
                    │  PostgreSQL Layer   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘


                    ┌─────────────────────┐
                    │      Organizer      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Organizer Login    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Organizer Dashboard │
                    │   Search/Attendance │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Flask Backend   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    └─────────────────────┘
```

---

# 📁 Project Structure

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

---

# 🗄️ Database Design

The application uses four main tables.

## Events

Stores information about available events.

```text
events
├── id
├── name
├── date
└── description
```

---

## Participants

Stores registered student information.

```text
participants
├── id
├── name
├── college_id
├── email
└── contact
```

The `college_id` is unique to prevent duplicate participant registration.

---

## Attendance

Connects participants with events and stores attendance status.

```text
attendance
├── id
├── event_id
├── participant_id
├── status
└── registration_token
```

The combination of `event_id` and `participant_id` is unique, preventing duplicate attendance records for the same event.

---

## Organizers

Stores authenticated organizer accounts.

```text
organizers
├── id
├── username
└── password_hash
```

Passwords are stored as hashes rather than plain text.

---

# 🔄 Application Workflow

## Registration

```text
Student
   ↓
Select Event
   ↓
Enter Details
   ↓
Validate Information
   ↓
Check Duplicate College ID
   ↓
Store Participant
   ↓
Create Attendance Record
   ↓
Registration Complete
```

## Attendance

```text
Organizer Login
       ↓
Select Event
       ↓
Search Participant
       ↓
Participant Found?
   ↙           ↘
 No             Yes
 ↓               ↓
Not Found     Show Details
                 ↓
          Check Attendance
                 ↓
          Mark as Present
                 ↓
          Update Dashboard
```

---

# 🔒 Authentication and Security

The organizer section is protected using session-based authentication.

The login process verifies the organizer credentials before allowing access to the dashboard.

Passwords are stored using Werkzeug's password hashing functionality rather than plain-text storage.

Sensitive deployment information such as the PostgreSQL connection URL and Flask secret key is stored using **environment variables** and is not included in the repository.

---

# 💾 Data Storage

The project initially used SQLite during development because it is simple to configure for local testing.

However, the deployed application uses **PostgreSQL** because a production web application should not depend on temporary local filesystem storage.

The PostgreSQL database is connected through the `DATABASE_URL` environment variable.

This provides persistent storage for:

- Events
- Participants
- Registrations
- Attendance
- Organizer accounts

---

# 📦 Requirements / Dependencies

The project dependencies are listed in `requirements.txt`.

Main dependencies include:

```text
Flask
psycopg2-binary
gunicorn
Werkzeug
```

The complete dependency list should be installed using:

```bash
pip install -r requirements.txt
```

---

# ⚙️ Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/GaikwadAtharva/SESA_Event_Attendance.git
```

## 2. Open the Project

```bash
cd SESA_Event_Attendance
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure Environment Variables

The application requires:

```text
DATABASE_URL
FLASK_SECRET_KEY
ORGANIZER_USERNAME
ORGANIZER_PASSWORD
```

These values should be configured in the local environment.

For security, sensitive credentials should not be committed to GitHub.

## 5. Run the Application

```bash
python app.py
```

The application will then be available on the local Flask server.

---

# ☁️ Deployment

The application is deployed using Render.

Deployment configuration:

```text
Environment: Python
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
Branch: main
```

The PostgreSQL database is connected using the Render `DATABASE_URL` environment variable.

---

# 🧪 Testing

The application was tested using multiple scenarios.

## Registration Tests

- Valid student registration
- Duplicate College ID
- Invalid/non-existent event
- Multiple participants

## Search Tests

- Search by Name
- Search by Email
- Search by College ID
- Search by Contact Number
- Search for non-existent participant

## Attendance Tests

- Mark registered participant as Present
- Attempt to mark the same participant again
- Verify Absent status before attendance
- Verify Present status after attendance

## Persistence Tests

- Refresh browser after marking attendance
- Close and reopen website
- Verify attendance remains stored

## Dashboard Tests

- Total registered count
- Present count
- Absent count
- Attendance percentage

---

# 🧠 Technical Challenge

## Problem

During deployment, the initial SQLite implementation caused event and attendance data to disappear after the Render service restarted or redeployed.

This happened because the deployed web service's local filesystem was not suitable for permanent application data.

## Solution

The application was migrated from SQLite to PostgreSQL.

The database layer was redesigned so that the Flask application could continue using a simple database interface while PostgreSQL handled persistent storage.

The deployed application now stores application data in PostgreSQL rather than relying on the web service's local filesystem.

---

# 🎯 Design Decisions

## Why Flask?

Flask was selected because:

- It is lightweight.
- It is easy to understand.
- It is suitable for a small web application.
- It allows clear separation between routes and database operations.

## Why PostgreSQL?

PostgreSQL was selected because:

- It provides persistent relational storage.
- It is suitable for deployed applications.
- It supports relationships between events, participants, and attendance.
- It avoids depending on temporary web-service filesystem storage.

## Why JavaScript?

JavaScript is used to:

- Dynamically load participants.
- Search participants.
- Update attendance.
- Refresh dashboard statistics without unnecessarily reloading the entire page.

## Why Session Authentication?

Organizer functionality should not be publicly accessible.

Session-based authentication provides a simple way to restrict access to the organizer dashboard.

---

# 📋 Assumptions

- Each student has a unique College ID.
- A participant can register only once for a particular event.
- Attendance is initially set to **Absent** when registration is created.
- An organizer marks a participant as Present after verifying their registration.
- Only authenticated organizers can access attendance management.
- Events are managed through the application/database rather than being created by students.
- The application is intended for college-level event attendance management.

---

# ✅ Technical Task Requirement Mapping

| Requirement | Implementation |
|---|---|
| Registration data | Student registration form |
| Name | Participant database |
| College ID | Participant database with uniqueness validation |
| Email | Participant database |
| Phone | Contact field |
| Participant list | Organizer dashboard |
| Search by Name | Implemented |
| Search by Email | Implemented |
| Search by Contact | Implemented |
| Search by College ID | Implemented |
| Verify registered participant | Implemented |
| Mark attendance | Implemented |
| Not registered handling | Implemented |
| Attendance persistence | PostgreSQL |
| Present/Absent distinction | Implemented |
| Total registered | Dashboard |
| Total present | Dashboard |
| Total absent | Dashboard |
| Attendance percentage | Dashboard |
| Organizer authentication | Implemented |
| README documentation | Included |
| Live deployment | Render |

---

# 🚀 Future Improvements

Possible future improvements include:

- QR-code based registration verification
- QR-code based attendance
- Import participants from CSV/Excel
- Year-wise attendance statistics
- Branch-wise attendance statistics
- Export attendance reports
- Multiple organizer accounts with different permissions
- Event creation directly from the organizer dashboard
- Improved audit logging
- Email confirmation after registration
- Mobile-friendly organizer interface

---

# 🎥 Demonstration

For evaluation, the recommended demonstration is:

```text
1. Open Live Application
        ↓
2. Register Students
        ↓
3. Login as Organizer
        ↓
4. Search Student
        ↓
5. Verify Details
        ↓
6. Mark Attendance
        ↓
7. View Dashboard Statistics
        ↓
8. Refresh Page
        ↓
9. Verify Persistent Attendance
```

---

# 👨‍💻 Author

**Atharva Gaikwad**

B.Tech — Computer Science (Software Engineering)

MIT Academy of Engineering

Developed for the **SESA Technical Team Selection Task**.

---

# 📌 Project Purpose

This project was developed to demonstrate practical software development skills including:

- Problem solving
- Full-stack web development
- Database design
- Authentication
- REST-style backend APIs
- Frontend interaction
- Data persistence
- Deployment
- Debugging
- Technical decision-making

The primary goal was to build a **simple, functional, reliable, and understandable event attendance system** rather than unnecessarily overcomplicating the solution.
