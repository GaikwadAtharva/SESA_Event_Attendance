# SESA Event Attendance Tracker

A full-stack web application developed for the **Software Engineering Students Association (SESA) Technical Team Selection Task**.

The application manages event registrations and allows organizers to search participants, mark attendance, and monitor attendance statistics through a dashboard. The application uses **PostgreSQL for persistent data storage**, ensuring that events, registrations, and attendance records remain available even after application restarts or redeployments.

---

## 🚀 Live Application

**Live Demo:**  
https://sesa-event-attendance.onrender.com

**GitHub Repository:**  
https://github.com/GaikwadAtharva/SESA_Event_Attendance

---

# 📌 1. Application Overview

The **SESA Event Attendance Tracker** is designed to solve a common event-management problem: efficiently registering students and verifying their attendance at the entrance of an event.

The system has two main sides:

### Student Side

Students can:

- View available events
- Register for an event
- Enter their:
  - Name
  - College ID
  - Email
  - Contact number
- Receive a unique registration token
- View their registration information and attendance status

### Organizer Side

Organizers can:

- Log in securely
- Create events
- View registered participants
- Search participants
- Search using:
  - Name
  - Email
  - Contact number
- View participant details
- Mark registered participants as **Present**
- View attendance statistics
- Monitor Present, Absent and Registered counts

---

# ✨ 2. Key Features

## Event Management

Organizers can create events with:

- Event name
- Event date
- Event description

Events are stored permanently in the PostgreSQL database.

---

## Student Registration

Students can register for an event by providing:

- Name
- College ID
- Email
- Contact number

The system prevents duplicate registration using the student's College ID.

---

## Participant Search

Organizers can search registered participants using:

- Name
- Email
- Contact number

The participant's current attendance status is displayed.

---

## Attendance Management

When a student arrives at the event:

1. The organizer searches for the student.
2. The system checks whether the student is registered.
3. If registered, the student's details are displayed.
4. The current attendance status is shown.
5. The organizer can mark the student as **Present**.

If the student is not registered, the system clearly indicates that the participant was not found.

---

## Attendance Persistence

Attendance is stored in PostgreSQL.

Therefore:

- Refreshing the page does not remove attendance.
- Closing and reopening the website does not remove attendance.
- Application restarts do not remove attendance.
- Render redeployments do not remove application data.

---

## 📊 Attendance Dashboard

The organizer dashboard provides:

- Total Registered
- Total Present
- Total Absent
- Attendance Percentage

Example:

| Statistic | Value |
|---|---:|
| Registered | 5 |
| Present | 3 |
| Absent | 2 |
| Attendance | 60% |

---

# 🛠️ 3. Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Python
- Flask

### Database

- PostgreSQL

### Authentication

- Flask Sessions
- Werkzeug Password Hashing

### Deployment

- Render

### Version Control

- Git
- GitHub

---

# 🏗️ 4. System Architecture

```text
                    ┌──────────────────────┐
                    │      Student         │
                    │   Web Interface      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Flask App       │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Event APIs       Registration APIs   Attendance APIs
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │      Database        │
                    └──────────────────────┘
                               ▲
                               │
                    ┌──────────┴───────────┐
                    │      Organizer       │
                    │      Dashboard       │
                    └──────────────────────┘
```

---

# 📁 5. Project Structure

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

# 🗄️ 6. Database Design

The application uses PostgreSQL with four main tables.

## Events

Stores information about SESA events.

```text
events
├── id
├── name
├── date
└── description
```

---

## Participants

Stores student registration information.

```text
participants
├── id
├── name
├── college_id
├── email
└── contact
```

The `college_id` is unique to prevent duplicate student records.

---

## Attendance

Connects participants with events and stores their attendance.

```text
attendance
├── id
├── event_id
├── participant_id
├── status
└── registration_token
```

The combination of:

```text
event_id + participant_id
```

is unique, preventing duplicate attendance records for the same event.

---

## Organizers

Stores organizer login credentials.

```text
organizers
├── id
├── username
└── password_hash
```

Passwords are stored as hashes rather than plain text.

---

# 🔄 7. Application Workflow

## Event Creation

```text
Organizer Login
      ↓
Create Event
      ↓
Event stored in PostgreSQL
      ↓
Event becomes available to students
```

## Student Registration

```text
Student selects Event
      ↓
Enters registration details
      ↓
Backend validates information
      ↓
Participant stored
      ↓
Attendance record created
      ↓
Initial status = Absent
      ↓
Registration token generated
```

## Entrance Attendance

```text
Organizer searches student
          ↓
Student found?
     ↙          ↘
   YES           NO
    ↓             ↓
Show details    Show "Not Found"
    ↓
Check status
    ↓
Mark Present
    ↓
Save to PostgreSQL
```

---

# 🔐 8. Organizer Authentication

The organizer dashboard is protected using session-based authentication.

An organizer must log in before accessing organizer functionality.

The application uses:

- Flask Sessions
- Environment variables for credentials
- Werkzeug password hashing

The organizer password is **not stored directly in the source code**.

Environment variables used:

```text
ORGANIZER_USERNAME
ORGANIZER_PASSWORD
FLASK_SECRET_KEY
DATABASE_URL
```

Sensitive credentials are kept outside the GitHub repository.

---

# 💾 9. Data Storage

Initially, the application used a local SQLite database.

However, local SQLite storage is not suitable for persistent deployment on the Render free web service because the application's local filesystem can be reset during redeployments or restarts.

Therefore, the final deployed version uses:

**PostgreSQL hosted through Render**

The Flask application connects to PostgreSQL using the `DATABASE_URL` environment variable.

This provides persistent storage for:

- Events
- Participants
- Registrations
- Attendance
- Organizer accounts

---

# 📦 10. Requirements / Dependencies

The main dependencies are:

```text
Flask
gunicorn
psycopg2-binary
Werkzeug
```

The complete dependency list is available in:

```text
requirements.txt
```

---

# 💻 11. Local Setup

## Step 1 — Clone the repository

```bash
git clone https://github.com/GaikwadAtharva/SESA_Event_Attendance.git
```

Move into the project:

```bash
cd SESA_Event_Attendance
```

---

## Step 2 — Install dependencies

```bash
pip install -r requirements.txt
```

---

## Step 3 — Configure environment variables

The application requires a PostgreSQL database connection.

Set:

```text
DATABASE_URL
ORGANIZER_USERNAME
ORGANIZER_PASSWORD
FLASK_SECRET_KEY
```

Do not commit these values to GitHub.

---

## Step 4 — Run the application

```bash
python app.py
```

The application will run locally using Flask.

---

# ☁️ 12. Deployment

The application is deployed using **Render**.

### Web Service

The Flask application runs using:

```text
gunicorn app:app
```

### Database

The application uses a Render PostgreSQL database.

The database connection is provided through:

```text
DATABASE_URL
```

This keeps the application data separate from the web service's temporary filesystem.

---

# 🧪 13. Testing

The application was tested using sample participant data.

| Name | College ID | Email | Contact |
|---|---|---|---|
| Aarav Sharma | MIT001 | aarav.sharma@example.com | 9000000001 |
| Riya Patil | MIT002 | riya.patil@example.com | 9000000002 |
| Aditya Kulkarni | MIT003 | aditya.kulkarni@example.com | 9000000003 |
| Sneha Joshi | MIT004 | sneha.joshi@example.com | 9000000004 |
| Rahul Deshmukh | MIT005 | rahul.deshmukh@example.com | 9000000005 |

Example attendance test:

```text
Total Registered = 5
Present = 3
Absent = 2
Attendance = 60%
```

---

# 🧩 14. Technical Challenge

### Challenge

The first deployed version used SQLite for data storage.

Although SQLite worked correctly during local development, data created on the deployed Render application did not persist reliably after service restarts or redeployments.

### Solution

The database architecture was changed from SQLite to PostgreSQL.

The Flask application was modified to connect to PostgreSQL using:

```text
DATABASE_URL
```

The required PostgreSQL Python driver was added:

```text
psycopg2-binary
```

This allowed the application to maintain persistent event, registration and attendance data.

### What I Learned

This helped me understand an important difference between:

- Local application storage
- Deployment environments
- Persistent databases
- Application filesystem
- Environment variables
- Production database configuration

---

# 🎯 15. Design Decisions

## Why Flask?

Flask was selected because:

- It is lightweight.
- It is easy to structure for a small web application.
- It provides routing and request handling.
- It works well with REST-style APIs.
- It allowed me to focus on application logic rather than unnecessary framework complexity.

---

## Why PostgreSQL?

PostgreSQL was selected because:

- It provides persistent relational storage.
- It is suitable for deployed applications.
- It supports relationships between events, participants and attendance.
- It prevents data loss caused by temporary application files.
- It provides stronger database functionality than a local file-based database for a deployed application.

---

## Why Separate Events, Participants and Attendance?

The database separates these entities so that:

- A participant can register for multiple events.
- Each event can have many participants.
- Attendance can be tracked separately for every event.
- Duplicate registrations can be prevented.
- Attendance records remain structured and easy to query.

---

# ⚠️ 16. Assumptions

The following assumptions were made:

1. Each student has a unique College ID.
2. A student cannot register for the same event more than once.
3. A participant who has registered but has not yet arrived is considered **Absent / Not Yet Marked**.
4. Only authenticated organizers can mark attendance.
5. Organizers are responsible for verifying the student's identity at the entrance.
6. The application is designed for SESA event management rather than large-scale public event management.
7. Organizer credentials are configured through environment variables.
8. PostgreSQL is used as the persistent production database.

---

# 📋 17. Technical Task Requirement Mapping

| Task Requirement | Implementation |
|---|---|
| Accept registration data | Student registration form |
| Name | Participant database |
| College ID | Participant database |
| Email | Participant database |
| Optional contact | Participant database |
| View participant list | Organizer dashboard |
| Search by name | Implemented |
| Search by email | Implemented |
| Search by contact | Implemented |
| Verify registered student | Organizer search |
| Show participant details | Organizer dashboard |
| Mark Present | Attendance API |
| Handle unregistered student | "Not Found" response |
| Persist attendance | PostgreSQL |
| Distinguish Present/Absent | Attendance status |
| Total registered | Dashboard |
| Total present | Dashboard |
| Total absent | Dashboard |
| Attendance percentage | Dashboard |
| Organizer authentication | Flask session authentication |
| Deployment | Render |
| Source code | GitHub |

---

# 🚀 18. Future Improvements

Possible improvements include:

- Year-wise attendance statistics
- Branch-wise attendance statistics
- QR-code based registration verification
- CSV participant import
- CSV attendance export
- Multiple organizer roles
- Event editing and deletion
- Better audit logging
- Email confirmation for registrations
- Advanced dashboard charts
- Pagination for large participant lists

---

# 🎥 19. Demo

**Live Application:**

https://sesa-event-attendance.onrender.com

**Source Code:**

https://github.com/GaikwadAtharva/SESA_Event_Attendance

---

# 👨‍💻 20. Author

**Atharva Gaikwad**

B.Tech — Computer Science / Software Engineering

MIT Academy of Engineering

---

# 📌 Project Purpose

This project was developed as part of the **SESA Technical Team Selection Task**.

The primary goal was not to build an unnecessarily complex system, but to demonstrate:

- Problem solving
- Backend development
- Database design
- API development
- Frontend integration
- Authentication
- Data persistence
- Deployment
- Debugging
- Understanding of technical decisions

The project was developed with a focus on **functionality, reliability, simplicity and practical software engineering.**
