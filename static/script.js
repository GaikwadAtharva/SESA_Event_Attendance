let allEvents = [];


// ===============================
// ORGANIZER LOGIN MODAL
// ===============================

function openOrganizer() {
    document.getElementById("organizerModal").classList.add("active");
}

function closeOrganizer() {
    document.getElementById("organizerModal").classList.remove("active");
}


window.addEventListener("click", function (event) {

    const modal = document.getElementById("organizerModal");

    if (event.target === modal) {
        closeOrganizer();
    }

});


// ===============================
// PARTICIPANT EVENTS PAGE
// ===============================

async function openParticipant() {

    const page = document.querySelector(".landing-page");

    page.innerHTML = `
        <div class="participant-page">

            <header class="participant-header">

                <div class="brand">

                    <div class="brand-logo">
                        S
                    </div>

                    <div class="brand-text">
                        <h2>SESA</h2>

                        <span>
                            Software Engineering Student Association
                        </span>
                    </div>

                </div>

                <div class="participant-header-actions">

                    <button
                        class="my-registration-button"
                        onclick="openMyRegistration()"
                    >
                        🎫 My Registration
                    </button>

                    <button
                        class="back-button"
                        onclick="location.reload()"
                    >
                        <span>←</span>
                        Home
                    </button>

                </div>

            </header>


            <section class="participant-hero">

                <div class="hero-glow glow-one"></div>
                <div class="hero-glow glow-two"></div>

                <div class="participant-hero-content">

                    <div class="hero-label">
                        <span></span>
                        SESA EVENTS
                    </div>

                    <h1>
                        Discover.
                        <span>Participate.</span>
                        Connect.
                    </h1>

                    <p>
                        Explore upcoming SESA events, workshops
                        and activities designed to help you learn,
                        collaborate and grow.
                    </p>

                </div>


                <div class="hero-decoration">

                    <div class="floating-card card-one">
                        <span>✦</span>
                        Learn
                    </div>

                    <div class="floating-card card-two">
                        <span>◉</span>
                        Connect
                    </div>

                    <div class="floating-card card-three">
                        <span>↗</span>
                        Grow
                    </div>

                </div>

            </section>


            <section class="events-area">

                <div class="events-toolbar">

                    <div>

                        <p class="section-label">
                            EXPLORE
                        </p>

                        <h2>
                            Upcoming Events
                        </h2>

                        <p>
                            Find an event that's right for you.
                        </p>

                    </div>


                    <div class="event-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            id="eventSearch"
                            placeholder="Search events..."
                            oninput="filterEvents()"
                        >

                    </div>

                </div>


                <div
                    id="eventsContainer"
                    class="events-grid"
                >

                    <div class="events-loading">

                        <div class="loading-spinner"></div>

                        <p>
                            Loading SESA events...
                        </p>

                    </div>

                </div>

            </section>


            <footer class="participant-footer">

                <div>

                    <strong>SESA</strong>

                    <span>
                        Software Engineering Student Association
                    </span>

                </div>

                <span>
                    © 2026 SESA
                </span>

            </footer>

        </div>
    `;


    await loadEvents();
}


// ===============================
// LOAD EVENTS
// ===============================

async function loadEvents() {

    const container =
        document.getElementById("eventsContainer");


    try {

        const response =
            await fetch("/api/events");


        if (!response.ok) {
            throw new Error("Unable to fetch events");
        }


        allEvents =
            await response.json();


        renderEvents(allEvents);


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <div class="events-error">

                <div class="error-icon">
                    !
                </div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    We couldn't load the events right now.
                </p>

                <button
                    onclick="loadEvents()"
                    class="retry-button"
                >
                    Try Again
                </button>

            </div>

        `;
    }
}


// ===============================
// RENDER EVENTS
// ===============================

function renderEvents(events) {

    const container =
        document.getElementById("eventsContainer");


    if (!events.length) {

        container.innerHTML = `

            <div class="events-empty">

                <div class="empty-icon">
                    ◌
                </div>

                <h3>
                    No events found
                </h3>

                <p>
                    Check back soon for upcoming SESA events.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        events.map((event, index) => {

            const dateInfo =
                getDateInfo(event.date);


            return `

                <article
                    class="event-card"
                    style="animation-delay: ${index * 0.08}s"
                >

                    <div class="event-card-header">

                        <div class="event-date-box">

                            <span>
                                ${dateInfo.month}
                            </span>

                            <strong>
                                ${dateInfo.day}
                            </strong>

                        </div>


                        <span class="event-status">
                            OPEN
                        </span>

                    </div>


                    <div class="event-card-content">

                        <p class="event-type">
                            SESA EVENT
                        </p>


                        <h3>
                            ${escapeHTML(event.name)}
                        </h3>


                        <p class="event-description">

                            ${escapeHTML(
                                event.description ||
                                "An exciting event organized by SESA."
                            )}

                        </p>

                    </div>


                    <div class="event-card-footer">

                        <span class="event-full-date">

                            ${formatDate(event.date)}

                        </span>


                        <button
                            class="event-button"
                            onclick="openRegistration(${event.id})"
                        >

                            Register Now

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </article>

            `;

        }).join("");
}


// ===============================
// SEARCH
// ===============================

function filterEvents() {

    const searchInput =
        document.getElementById("eventSearch");


    const search =
        searchInput.value.toLowerCase().trim();


    const filtered =
        allEvents.filter(event => {

            return (

                event.name
                    .toLowerCase()
                    .includes(search)

                ||

                (event.description || "")
                    .toLowerCase()
                    .includes(search)

            );

        });


    renderEvents(filtered);
}


// ===============================
// OPEN REGISTRATION
// ===============================

async function openRegistration(eventId) {

    const event =
        allEvents.find(
            item => item.id === eventId
        );


    if (!event) {
        return;
    }


    const page =
        document.querySelector(".landing-page");


    page.innerHTML = `

        <div class="participant-page">

            <header class="participant-header">

                <div class="brand">

                    <div class="brand-logo">
                        S
                    </div>

                    <div class="brand-text">

                        <h2>SESA</h2>

                        <span>
                            Software Engineering Student Association
                        </span>

                    </div>

                </div>


                <button
                    class="back-button"
                    onclick="openParticipant()"
                >

                    <span>←</span>
                    Back to Events

                </button>

            </header>


            <section class="registration-wrapper">

                <div class="registration-container">


                    <div class="registration-event">

                        <p class="section-label">
                            EVENT REGISTRATION
                        </p>


                        <div class="registration-date">

                            <div class="event-date-box">

                                <span>
                                    ${getDateInfo(event.date).month}
                                </span>

                                <strong>
                                    ${getDateInfo(event.date).day}
                                </strong>

                            </div>


                            <div>

                                <p>
                                    ${formatDate(event.date)}
                                </p>

                                <span>
                                    SESA EVENT
                                </span>

                            </div>

                        </div>


                        <h1>
                            ${escapeHTML(event.name)}
                        </h1>


                        <p class="registration-description">

                            ${escapeHTML(
                                event.description ||
                                "Join this SESA event and be part of the experience."
                            )}

                        </p>


                        <div class="registration-info">

                            <div>
                                <span>✓</span>
                                Open for registration
                            </div>

                            <div>
                                <span>🔒</span>
                                Secure registration
                            </div>

                            <div>
                                <span>◉</span>
                                Attendance tracked
                            </div>

                        </div>

                    </div>


                    <div class="registration-form-card">

                        <div class="form-heading">

                            <p>
                                YOUR DETAILS
                            </p>

                            <h2>
                                Register for this event
                            </h2>

                            <span>
                                Fill in your details below to reserve your spot.
                            </span>

                        </div>


                        <form
                            id="registrationForm"
                            onsubmit="submitRegistration(event, ${event.id})"
                        >


                            <div class="form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    id="registrationName"
                                    placeholder="Enter your full name"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    College ID
                                </label>

                                <input
                                    type="text"
                                    id="registrationCollegeId"
                                    placeholder="e.g. MITAOE001"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    id="registrationEmail"
                                    placeholder="you@example.com"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Contact Number
                                    <span>(Optional)</span>
                                </label>

                                <input
                                    type="tel"
                                    id="registrationContact"
                                    placeholder="Enter your contact number"
                                >

                            </div>


                            <p
                                id="registrationError"
                                class="registration-error"
                            >
                            </p>


                            <button
                                type="submit"
                                class="registration-submit"
                                id="registrationSubmit"
                            >

                                Complete Registration

                                <span>
                                    →
                                </span>

                            </button>


                            <p class="form-security-note">

                                🔒 Your information is securely stored
                                for event management purposes.

                            </p>

                        </form>

                    </div>

                </div>

            </section>

        </div>

    `;
}


// ===============================
// SUBMIT REGISTRATION
// ===============================

async function submitRegistration(event, eventId) {

    event.preventDefault();


    const submitButton =
        document.getElementById(
            "registrationSubmit"
        );


    const errorMessage =
        document.getElementById(
            "registrationError"
        );


    const name =
        document.getElementById(
            "registrationName"
        ).value.trim();


    const collegeId =
        document.getElementById(
            "registrationCollegeId"
        ).value.trim();


    const email =
        document.getElementById(
            "registrationEmail"
        ).value.trim();


    const contact =
        document.getElementById(
            "registrationContact"
        ).value.trim();


    errorMessage.textContent = "";


    submitButton.disabled = true;

    submitButton.innerHTML = `
        Registering...
        <span>...</span>
    `;


    try {

        const response =
            await fetch(
                `/api/events/${eventId}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        college_id:
                            collegeId,

                        email: email,

                        contact: contact

                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            errorMessage.textContent =
                result.error ||
                "Registration failed.";

            submitButton.disabled = false;

            submitButton.innerHTML = `
                Complete Registration
                <span>→</span>
            `;

            return;
        }


        showRegistrationSuccess(result);


    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to connect to the server.";

        submitButton.disabled = false;

        submitButton.innerHTML = `
            Complete Registration
            <span>→</span>
        `;
    }
}


// ===============================
// REGISTRATION SUCCESS
// ===============================

function showRegistrationSuccess(result) {

    const page =
        document.querySelector(".landing-page");


    page.innerHTML = `

        <div class="participant-page">

            <header class="participant-header">

                <div class="brand">

                    <div class="brand-logo">
                        S
                    </div>

                    <div class="brand-text">

                        <h2>
                            SESA
                        </h2>

                        <span>
                            Software Engineering Student Association
                        </span>

                    </div>

                </div>

            </header>


            <section class="success-section">

                <div class="success-card">

                    <div class="success-icon">
                        ✓
                    </div>


                    <p class="section-label">
                        REGISTRATION COMPLETE
                    </p>


                    <h1>
                        You're registered!
                    </h1>


                    <p>
                        Your registration for
                        <strong>
                            ${escapeHTML(result.event_name)}
                        </strong>
                        has been successfully completed.
                    </p>


                    <div class="registration-id-box">

                        <span>
                            YOUR REGISTRATION ID
                        </span>

                        <strong>
                            ${escapeHTML(result.registration_token)}
                        </strong>

                        <p>
                            Keep this ID safe to view your
                            registration later.
                        </p>

                    </div>


                    <div class="success-details">

                        <div>

                            <span>
                                Registration Status
                            </span>

                            <strong>
                                Confirmed
                            </strong>

                        </div>


                        <div>

                            <span>
                                Attendance
                            </span>

                            <strong>
                                Not Yet Marked
                            </strong>

                        </div>

                    </div>


                    <div class="success-actions">

                        <button
                            class="registration-submit"
                            onclick="openMyRegistration('${escapeHTML(result.registration_token)}')"
                        >

                            View My Registration

                            <span>
                                →
                            </span>

                        </button>


                        <button
                            class="secondary-action-button"
                            onclick="openParticipant()"
                        >

                            Explore More Events

                            <span>
                                →
                            </span>

                        </button>

                    </div>


                    <p class="form-security-note">

                        🔐 Your registration ID is private.
                        Do not share it with others.

                    </p>

                </div>

            </section>

        </div>

    `;
}


// ===============================
// MY REGISTRATION
// ===============================

function openMyRegistration(existingToken = "") {

    const page =
        document.querySelector(".landing-page");


    page.innerHTML = `

        <div class="participant-page">

            <header class="participant-header">

                <div class="brand">

                    <div class="brand-logo">
                        S
                    </div>

                    <div class="brand-text">

                        <h2>
                            SESA
                        </h2>

                        <span>
                            Software Engineering Student Association
                        </span>

                    </div>

                </div>


                <button
                    class="back-button"
                    onclick="openParticipant()"
                >

                    <span>←</span>
                    Back to Events

                </button>

            </header>


            <section class="my-registration-section">

                <div class="my-registration-card">

                    <div class="my-registration-icon">
                        🎫
                    </div>


                    <p class="section-label">
                        MY REGISTRATION
                    </p>


                    <h1>
                        View your registration
                    </h1>


                    <p class="my-registration-description">

                        Enter the private Registration ID you received
                        after registering for a SESA event.

                    </p>


                    <div class="form-group">

                        <label>
                            Registration ID
                        </label>

                        <input
                            type="text"
                            id="registrationTokenInput"
                            placeholder="Enter your Registration ID"
                            value="${existingToken}"
                        >

                    </div>


                    <p
                        id="myRegistrationError"
                        class="registration-error"
                    >
                    </p>


                    <button
                        class="registration-submit"
                        onclick="lookupRegistration()"
                    >

                        Find My Registration

                        <span>
                            →
                        </span>

                    </button>


                    <p class="form-security-note">

                        🔒 Your Registration ID is private.
                        Only someone with the ID can access this registration.

                    </p>

                </div>

            </section>

        </div>

    `;


    if (existingToken) {
        lookupRegistration();
    }
}


// ===============================
// LOOKUP REGISTRATION
// ===============================

async function lookupRegistration() {

    const input =
        document.getElementById(
            "registrationTokenInput"
        );


    const errorMessage =
        document.getElementById(
            "myRegistrationError"
        );


    if (!input) {
        return;
    }


    const token =
        input.value.trim();


    errorMessage.textContent = "";


    if (!token) {

        errorMessage.textContent =
            "Please enter your Registration ID.";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/registration/${encodeURIComponent(token)}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            errorMessage.textContent =
                result.error ||
                "Registration not found.";

            return;
        }


        showMyRegistration(result);


    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to connect to the server.";

    }
}


// ===============================
// SHOW MY REGISTRATION
// ===============================

function showMyRegistration(result) {

    const page =
        document.querySelector(".landing-page");


    const isPresent =
        result.status === "Present";


    page.innerHTML = `

        <div class="participant-page">

            <header class="participant-header">

                <div class="brand">

                    <div class="brand-logo">
                        S
                    </div>

                    <div class="brand-text">

                        <h2>
                            SESA
                        </h2>

                        <span>
                            Software Engineering Student Association
                        </span>

                    </div>

                </div>


                <button
                    class="back-button"
                    onclick="openParticipant()"
                >

                    <span>←</span>
                    Events

                </button>

            </header>


            <section class="registration-details-section">

                <div class="registration-details-card">


                    <div class="registration-details-top">

                        <div>

                            <p class="section-label">
                                REGISTRATION DETAILS
                            </p>

                            <h1>
                                ${escapeHTML(result.event_name)}
                            </h1>

                            <p>
                                ${escapeHTML(
                                    formatDate(result.event_date)
                                )}
                            </p>

                        </div>


                        <div class="registration-status-badge">

                            <span>
                                ✓
                            </span>

                            REGISTERED

                        </div>

                    </div>


                    <div class="registration-profile">

                        <div class="registration-profile-icon">
                            ${escapeHTML(
                                result.participant_name
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>


                        <div>

                            <span>
                                PARTICIPANT
                            </span>

                            <h2>
                                ${escapeHTML(result.participant_name)}
                            </h2>

                        </div>

                    </div>


                    <div class="registration-details-grid">


                        <div class="registration-detail-item">

                            <span>
                                COLLEGE ID
                            </span>

                            <strong>
                                ${escapeHTML(result.college_id)}
                            </strong>

                        </div>


                        <div class="registration-detail-item">

                            <span>
                                EMAIL
                            </span>

                            <strong>
                                ${escapeHTML(result.email)}
                            </strong>

                        </div>


                        <div class="registration-detail-item">

                            <span>
                                CONTACT
                            </span>

                            <strong>
                                ${escapeHTML(
                                    result.contact ||
                                    "Not provided"
                                )}
                            </strong>

                        </div>


                        <div class="registration-detail-item">

                            <span>
                                ATTENDANCE
                            </span>

                            <strong class="${isPresent ? "present-status" : "absent-status"}">

                                ${isPresent
                                    ? "✓ Present"
                                    : "Not Yet Marked"
                                }

                            </strong>

                        </div>

                    </div>


                    <div class="registration-token-display">

                        <span>
                            REGISTRATION ID
                        </span>

                        <strong>
                            ${escapeHTML(result.registration_token)}
                        </strong>

                    </div>


                    <div class="registration-details-actions">

                        <button
                            class="secondary-action-button"
                            onclick="openParticipant()"
                        >

                            ← Back to Events

                        </button>

                    </div>


                    <p class="form-security-note">

                        🔐 Keep your Registration ID private.

                    </p>

                </div>

            </section>

        </div>

    `;
}


// ===============================
// DATE HELPERS
// ===============================

function getDateInfo(dateString) {

    const date =
        new Date(dateString);


    if (isNaN(date)) {

        return {
            day: "--",
            month: "---"
        };

    }


    return {

        day: date.getDate(),

        month:
            date.toLocaleDateString(
                "en-IN",
                {
                    month: "short"
                }
            ).toUpperCase()

    };
}


function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (isNaN(date)) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


// ===============================
// HTML SAFETY
// ===============================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ===============================
// ORGANIZER LOGIN
// ===============================

const organizerLoginForm =
    document.getElementById(
        "organizerLoginForm"
    );


if (organizerLoginForm) {

    organizerLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "organizerUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "organizerPassword"
                ).value;


            const errorMessage =
                document.getElementById(
                    "loginError"
                );


            errorMessage.textContent = "";


            try {

                const response =
                    await fetch(
                        "/api/organizer/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username: username,
                                password: password
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    errorMessage.textContent =
                        result.error ||
                        "Invalid credentials.";

                    return;
                }


                window.location.href =
                    "/organizer";


            } catch (error) {

                console.error(error);

                errorMessage.textContent =
                    "Unable to connect to the server.";

            }

        }
    );
}