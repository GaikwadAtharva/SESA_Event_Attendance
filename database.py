import sqlite3

DATABASE = "database.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_db_connection()

    # Events created by SESA
    connection.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT
        )
    """)

    # All participants registered in the system
    connection.execute("""
        CREATE TABLE IF NOT EXISTS participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            college_id TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            contact TEXT
        )
    """)

    # Links participants with events
    # This table also stores attendance status.
    connection.execute("""
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            participant_id INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'Absent',
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (participant_id) REFERENCES participants(id),
            UNIQUE (event_id, participant_id)
        )
    """)

    # Organizer accounts
    connection.execute("""
        CREATE TABLE IF NOT EXISTS organizers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)

    # =========================================================
    # REGISTRATION TOKEN MIGRATION
    # =========================================================
    #
    # Each event registration gets a private token.
    # This allows a participant to view their own registration
    # without exposing other participants' information.
    #

    columns = connection.execute(
        "PRAGMA table_info(attendance)"
    ).fetchall()

    column_names = [
        column["name"]
        for column in columns
    ]

    if "registration_token" not in column_names:

        connection.execute("""
            ALTER TABLE attendance
            ADD COLUMN registration_token TEXT
        """)

    # Make sure existing registrations also receive a token.
    existing_registrations = connection.execute("""
        SELECT id
        FROM attendance
        WHERE registration_token IS NULL
    """).fetchall()

    import secrets

    for registration in existing_registrations:

        token = secrets.token_urlsafe(16)

        connection.execute("""
            UPDATE attendance
            SET registration_token = ?
            WHERE id = ?
        """, (
            token,
            registration["id"]
        ))

    connection.commit()
    connection.close()