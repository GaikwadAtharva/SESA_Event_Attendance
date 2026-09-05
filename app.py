from flask import Flask, request, jsonify, render_template, session, redirect
from werkzeug.security import check_password_hash, generate_password_hash
from database import create_tables, get_db_connection
import os
import secrets

app = Flask(__name__)

# Secret used to protect organizer login sessions
app.secret_key = os.environ.get(
    "FLASK_SECRET_KEY",
    "sesa-development-secret-key"
)

# Create database tables
create_tables()


# =========================================================
# CREATE DEFAULT ORGANIZER
# =========================================================

def create_default_organizer():
    """
    Creates the SESA organizer account if it does not already exist.

    Username and password are taken from environment variables.
    """

    username = os.environ.get("ORGANIZER_USERNAME", "sesa_admin")
    password = os.environ.get("ORGANIZER_PASSWORD")

    # Do not create an account if no password has been configured
    if not password:
        print("WARNING: ORGANIZER_PASSWORD is not set.")
        return

    connection = get_db_connection()

    existing_organizer = connection.execute(
        """
        SELECT id
        FROM organizers
        WHERE username = ?
        """,
        (username,)
    ).fetchone()

    if not existing_organizer:

        password_hash = generate_password_hash(password)

        connection.execute(
            """
            INSERT INTO organizers
            (username, password_hash)
            VALUES (?, ?)
            """,
            (
                username,
                password_hash
            )
        )

        connection.commit()

        print(f"Organizer account '{username}' created.")

    connection.close()


create_default_organizer()


# =========================================================
# PUBLIC WEBSITE
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


# =========================================================
# ORGANIZER DASHBOARD PAGE
# =========================================================

@app.route("/organizer")
def organizer_dashboard():

    # Only logged-in organizers can access dashboard
    if "organizer_id" not in session:
        return redirect("/")

    return render_template("organizer.html")


# =========================================================
# ORGANIZER AUTHENTICATION
# =========================================================

@app.route("/api/organizer/login", methods=["POST"])
def organizer_login():

    data = request.get_json() or {}

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:

        return jsonify({
            "error": "Username and password are required"
        }), 400

    connection = get_db_connection()

    organizer = connection.execute(
        """
        SELECT id, username, password_hash
        FROM organizers
        WHERE username = ?
        """,
        (username,)
    ).fetchone()

    connection.close()

    if not organizer or not check_password_hash(
        organizer["password_hash"],
        password
    ):

        return jsonify({
            "error": "Invalid organizer credentials"
        }), 401

    session["organizer_id"] = organizer["id"]
    session["organizer_username"] = organizer["username"]

    return jsonify({
        "message": "Organizer login successful",
        "username": organizer["username"]
    }), 200


@app.route("/api/organizer/logout", methods=["POST"])
def organizer_logout():

    session.pop("organizer_id", None)
    session.pop("organizer_username", None)

    return jsonify({
        "message": "Organizer logged out successfully"
    }), 200


@app.route("/api/organizer/status", methods=["GET"])
def organizer_status():

    if "organizer_id" not in session:

        return jsonify({
            "logged_in": False
        })

    return jsonify({
        "logged_in": True,
        "username": session.get("organizer_username")
    })


def organizer_required():

    if "organizer_id" not in session:

        return jsonify({
            "error": "Organizer login required"
        }), 401

    return None


# =========================================================
# EVENT MANAGEMENT
# =========================================================

@app.route("/api/events", methods=["POST"])
def create_event():

    auth_error = organizer_required()

    if auth_error:
        return auth_error

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    date = data.get("date", "").strip()
    description = data.get("description", "").strip()

    if not name or not date:

        return jsonify({
            "error": "Event name and date are required"
        }), 400

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO events
        (name, date, description)
        VALUES (?, ?, ?)
        """,
        (
            name,
            date,
            description
        )
    )

    connection.commit()

    event_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Event created successfully",
        "event_id": event_id
    }), 201


# Public - anyone can view events
@app.route("/api/events", methods=["GET"])
def get_events():

    connection = get_db_connection()

    events = connection.execute(
        """
        SELECT id, name, date, description
        FROM events
        ORDER BY date ASC
        """
    ).fetchall()

    connection.close()

    return jsonify([
        dict(event)
        for event in events
    ])


@app.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):

    connection = get_db_connection()

    event = connection.execute(
        """
        SELECT id, name, date, description
        FROM events
        WHERE id = ?
        """,
        (event_id,)
    ).fetchone()

    connection.close()

    if not event:

        return jsonify({
            "error": "Event not found"
        }), 404

    return jsonify(dict(event))


# =========================================================
# PARTICIPANT REGISTRATION
# =========================================================

@app.route(
    "/api/events/<int:event_id>/register",
    methods=["POST"]
)
def register_for_event(event_id):

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    college_id = data.get("college_id", "").strip()
    email = data.get("email", "").strip()
    contact = data.get("contact", "").strip()

    if not name or not college_id or not email:

        return jsonify({
            "error": "Name, College ID and Email are required"
        }), 400

    connection = get_db_connection()

    # Check whether event exists
    event = connection.execute(
        """
        SELECT id, name
        FROM events
        WHERE id = ?
        """,
        (event_id,)
    ).fetchone()

    if not event:

        connection.close()

        return jsonify({
            "error": "Event not found"
        }), 404

    # Check whether participant already exists
    participant = connection.execute(
        """
        SELECT id, name, college_id, email, contact
        FROM participants
        WHERE college_id = ?
        """,
        (college_id,)
    ).fetchone()

    try:

        # Existing participant
        if participant:

            participant_id = participant["id"]

            # Check duplicate registration
            existing_registration = connection.execute(
                """
                SELECT id
                FROM attendance
                WHERE event_id = ?
                AND participant_id = ?
                """,
                (
                    event_id,
                    participant_id
                )
            ).fetchone()

            if existing_registration:

                connection.close()

                return jsonify({
                    "error": "You are already registered for this event"
                }), 409

        # New participant
        else:

            cursor = connection.execute(
                """
                INSERT INTO participants
                (name, college_id, email, contact)
                VALUES (?, ?, ?, ?)
                """,
                (
                    name,
                    college_id,
                    email,
                    contact
                )
            )

            participant_id = cursor.lastrowid

        # Generate unique private registration token
        registration_token = secrets.token_urlsafe(24)

        # Create registration / attendance record
        connection.execute(
            """
            INSERT INTO attendance
            (
                event_id,
                participant_id,
                status,
                registration_token
            )
            VALUES (?, ?, 'Absent', ?)
            """,
            (
                event_id,
                participant_id,
                registration_token
            )
        )

        connection.commit()
        connection.close()

        return jsonify({
            "message": "Registration successful",
            "event_id": event_id,
            "participant_id": participant_id,
            "event_name": event["name"],
            "status": "Absent",
            "registration_token": registration_token
        }), 201

    except Exception as error:

        connection.rollback()
        connection.close()

        return jsonify({
            "error": str(error)
        }), 400


# =========================================================
# VIEW REGISTRATION
# =========================================================

@app.route(
    "/api/registration/<registration_token>",
    methods=["GET"]
)
def get_registration(registration_token):

    connection = get_db_connection()

    registration = connection.execute(
        """
        SELECT
            a.id AS registration_id,
            a.registration_token,
            a.status,
            e.id AS event_id,
            e.name AS event_name,
            e.date AS event_date,
            e.description AS event_description,
            p.name AS participant_name,
            p.college_id,
            p.email,
            p.contact

        FROM attendance a

        INNER JOIN events e
            ON a.event_id = e.id

        INNER JOIN participants p
            ON a.participant_id = p.id

        WHERE a.registration_token = ?
        """,
        (registration_token,)
    ).fetchone()

    connection.close()

    if not registration:

        return jsonify({
            "error": "Registration not found"
        }), 404

    return jsonify(dict(registration))


# =========================================================
# ORGANIZER PARTICIPANTS
# =========================================================

@app.route(
    "/api/events/<int:event_id>/participants",
    methods=["GET"]
)
def search_participants(event_id):

    auth_error = organizer_required()

    if auth_error:
        return auth_error

    search = request.args.get(
        "search",
        ""
    ).strip()

    connection = get_db_connection()

    event = connection.execute(
        """
        SELECT id
        FROM events
        WHERE id = ?
        """,
        (event_id,)
    ).fetchone()

    if not event:

        connection.close()

        return jsonify({
            "error": "Event not found"
        }), 404

    if search:

        participants = connection.execute(
            """
            SELECT
                p.id,
                p.name,
                p.college_id,
                p.email,
                p.contact,
                a.status

            FROM participants p

            INNER JOIN attendance a
                ON p.id = a.participant_id

            WHERE a.event_id = ?

            AND (
                p.name LIKE ?
                OR p.college_id LIKE ?
                OR p.email LIKE ?
                OR p.contact LIKE ?
            )

            ORDER BY p.name
            """,
            (
                event_id,
                f"%{search}%",
                f"%{search}%",
                f"%{search}%",
                f"%{search}%"
            )
        ).fetchall()

    else:

        participants = connection.execute(
            """
            SELECT
                p.id,
                p.name,
                p.college_id,
                p.email,
                p.contact,
                a.status

            FROM participants p

            INNER JOIN attendance a
                ON p.id = a.participant_id

            WHERE a.event_id = ?

            ORDER BY p.name
            """,
            (event_id,)
        ).fetchall()

    connection.close()

    return jsonify([
        dict(participant)
        for participant in participants
    ])


# =========================================================
# MARK ATTENDANCE
# =========================================================

@app.route(
    "/api/events/<int:event_id>/participants/<int:participant_id>/attendance",
    methods=["PUT"]
)
def mark_attendance(event_id, participant_id):

    auth_error = organizer_required()

    if auth_error:
        return auth_error

    connection = get_db_connection()

    attendance = connection.execute(
        """
        SELECT id, status
        FROM attendance
        WHERE event_id = ?
        AND participant_id = ?
        """,
        (
            event_id,
            participant_id
        )
    ).fetchone()

    if not attendance:

        connection.close()

        return jsonify({
            "error": "Participant is not registered for this event"
        }), 404

    if attendance["status"] == "Present":

        connection.close()

        return jsonify({
            "message": "Attendance already marked",
            "status": "Present"
        }), 200

    connection.execute(
        """
        UPDATE attendance
        SET status = 'Present'
        WHERE event_id = ?
        AND participant_id = ?
        """,
        (
            event_id,
            participant_id
        )
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Attendance marked successfully",
        "event_id": event_id,
        "participant_id": participant_id,
        "status": "Present"
    }), 200


# =========================================================
# EVENT DASHBOARD
# =========================================================

@app.route(
    "/api/events/<int:event_id>/dashboard",
    methods=["GET"]
)
def event_dashboard(event_id):

    auth_error = organizer_required()

    if auth_error:
        return auth_error

    connection = get_db_connection()

    event = connection.execute(
        """
        SELECT id, name, date, description
        FROM events
        WHERE id = ?
        """,
        (event_id,)
    ).fetchone()

    if not event:

        connection.close()

        return jsonify({
            "error": "Event not found"
        }), 404

    total_registered = connection.execute(
        """
        SELECT COUNT(*)
        FROM attendance
        WHERE event_id = ?
        """,
        (event_id,)
    ).fetchone()[0]

    total_present = connection.execute(
        """
        SELECT COUNT(*)
        FROM attendance
        WHERE event_id = ?
        AND status = 'Present'
        """,
        (event_id,)
    ).fetchone()[0]

    total_absent = total_registered - total_present

    if total_registered > 0:

        attendance_percentage = round(
            (
                total_present /
                total_registered
            ) * 100,
            2
        )

    else:

        attendance_percentage = 0

    connection.close()

    return jsonify({

        "event": dict(event),

        "total_registered":
            total_registered,

        "present":
            total_present,

        "absent":
            total_absent,

        "attendance_percentage":
            attendance_percentage

    })


# =========================================================
# ORGANIZER LOGOUT PAGE
# =========================================================

@app.route("/organizer/logout")
def organizer_logout_page():

    session.pop("organizer_id", None)
    session.pop("organizer_username", None)

    return redirect("/")


# =========================================================
# RUN APPLICATION
# =========================================================

if __name__ == "__main__":
    app.run(debug=True)
