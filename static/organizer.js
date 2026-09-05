document.addEventListener("DOMContentLoaded", () => {

    let selectedEventId = null;
    let allEvents = [];
    let allParticipants = [];

    const eventsContainer =
        document.getElementById("organizerEvents");

    const participantsTable =
        document.getElementById("participantsTable");

    const searchInput =
        document.getElementById("participantSearch");

    const totalEvents =
        document.getElementById("totalEvents");

    const totalRegistered =
        document.getElementById("totalRegistered");

    const totalPresent =
        document.getElementById("totalPresent");

    const totalAbsent =
        document.getElementById("totalAbsent");

    const attendancePercentage =
        document.getElementById("attendancePercentage");


    /* ==========================================
       CREATE EVENT MODAL ELEMENTS
    ========================================== */

    const createEventModal =
        document.getElementById("createEventModal");

    const createEventForm =
        document.getElementById("createEventForm");

    const closeCreateEventModal =
        document.getElementById("closeCreateEventModal");

    const cancelCreateEvent =
        document.getElementById("cancelCreateEvent");

    const createEventError =
        document.getElementById("createEventError");

    const submitCreateEvent =
        document.getElementById("submitCreateEvent");

    const submitCreateEventText =
        document.querySelector(".create-event-submit-text");

    const submitCreateEventLoader =
        document.querySelector(".create-event-submit-loader");


    /* ==========================================
       LOAD EVENTS
    ========================================== */

    async function loadEvents() {

        try {

            const response =
                await fetch("/api/events");

            if (!response.ok) {
                throw new Error("Failed to load events");
            }

            allEvents =
                await response.json();

            renderEvents();

            totalEvents.textContent =
                allEvents.length;

            if (allEvents.length > 0) {

                if (
                    selectedEventId === null ||
                    !allEvents.some(
                        event => event.id === selectedEventId
                    )
                ) {

                    selectEvent(allEvents[0].id);

                } else {

                    await loadParticipants(selectedEventId);
                    await loadDashboardStats(selectedEventId);

                }

            } else {

                selectedEventId = null;

                participantsTable.innerHTML = `
                    <tr>
                        <td colspan="5"
                            class="dashboard-loading">
                            Select an event to view participants.
                        </td>
                    </tr>
                `;

                totalRegistered.textContent = "0";
                totalPresent.textContent = "0";
                totalAbsent.textContent = "0";
                attendancePercentage.textContent = "0%";
            }

        } catch (error) {

            console.error(error);

            eventsContainer.innerHTML = `
                <div class="dashboard-error">
                    Unable to load events.
                </div>
            `;
        }
    }


    /* ==========================================
       RENDER EVENTS
    ========================================== */

    function renderEvents() {

        if (allEvents.length === 0) {

            eventsContainer.innerHTML = `
                <div class="dashboard-empty">
                    <div>📅</div>
                    <h3>No events yet</h3>
                    <p>Create your first SESA event.</p>
                </div>
            `;

            return;
        }


        eventsContainer.innerHTML =
            allEvents.map(event => {

                const eventDate =
                    new Date(event.date);

                const day =
                    eventDate.getDate();

                const month =
                    eventDate.toLocaleString(
                        "en-US",
                        {
                            month: "short"
                        }
                    );


                return `
                    <div
                        class="organizer-event-card ${
                            selectedEventId === event.id
                                ? "selected"
                                : ""
                        }"
                        data-event-id="${event.id}"
                    >

                        <div class="organizer-event-top">

                            <div class="organizer-event-date">

                                <strong>
                                    ${day}
                                </strong>

                                <span>
                                    ${month}
                                </span>

                            </div>

                            <span class="event-status">
                                ACTIVE
                            </span>

                        </div>


                        <div class="organizer-event-content">

                            <h3>
                                ${escapeHTML(event.name)}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    event.description ||
                                    "SESA Event"
                                )}
                            </p>

                        </div>


                        <div class="organizer-event-footer">

                            <span>
                                View Participants
                            </span>

                            <span class="event-arrow">
                                →
                            </span>

                        </div>

                    </div>
                `;

            }).join("");


        document
            .querySelectorAll(".organizer-event-card")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => {

                        const eventId =
                            Number(
                                card.dataset.eventId
                            );

                        selectEvent(eventId);

                    }
                );

            });
    }


    /* ==========================================
       SELECT EVENT
    ========================================== */

    async function selectEvent(eventId) {

        selectedEventId = eventId;

        renderEvents();

        await loadParticipants(eventId);

        await loadDashboardStats(eventId);
    }


    /* ==========================================
       LOAD PARTICIPANTS
    ========================================== */

    async function loadParticipants(eventId) {

        participantsTable.innerHTML = `
            <tr>
                <td colspan="5"
                    class="dashboard-loading">
                    Loading participants...
                </td>
            </tr>
        `;


        try {

            const response =
                await fetch(
                    `/api/events/${eventId}/participants`
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to load participants"
                );
            }

            allParticipants =
                await response.json();

            renderParticipants(allParticipants);

        } catch (error) {

            console.error(error);

            participantsTable.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="dashboard-error">
                        Unable to load participants.
                    </td>
                </tr>
            `;
        }
    }


    /* ==========================================
       RENDER PARTICIPANTS
    ========================================== */

    function renderParticipants(participants) {

        if (participants.length === 0) {

            participantsTable.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="dashboard-empty">
                        No participants registered
                        for this event.
                    </td>
                </tr>
            `;

            return;
        }


        participantsTable.innerHTML =
            participants.map(participant => {

                const isPresent =
                    participant.status === "Present";


                return `
                    <tr>

                        <td>

                            <div class="participant-cell">

                                <div class="participant-avatar">
                                    ${getInitials(
                                        participant.name
                                    )}
                                </div>

                                <div>

                                    <strong>
                                        ${escapeHTML(
                                            participant.name
                                        )}
                                    </strong>

                                    <span>
                                        Participant
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${escapeHTML(
                                participant.college_id
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                participant.email
                            )}
                        </td>


                        <td>

                            <span class="
                                attendance-badge
                                ${
                                    isPresent
                                        ? "present"
                                        : "absent"
                                }
                            ">

                                <span
                                    class="attendance-dot"
                                ></span>

                                ${
                                    isPresent
                                        ? "Present"
                                        : "Absent"
                                }

                            </span>

                        </td>


                        <td>

                            ${
                                isPresent

                                ? `
                                    <button
                                        class="
                                            attendance-button
                                            marked
                                        "
                                        disabled
                                    >
                                        ✓ Marked
                                    </button>
                                  `

                                : `
                                    <button
                                        class="
                                            attendance-button
                                        "
                                        data-participant-id="${
                                            participant.id
                                        }"
                                    >
                                        Mark Present
                                    </button>
                                  `
                            }

                        </td>

                    </tr>
                `;

            }).join("");


        document
            .querySelectorAll(
                ".attendance-button:not(.marked)"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const participantId =
                            Number(
                                button.dataset
                                    .participantId
                            );

                        await markAttendance(
                            selectedEventId,
                            participantId,
                            button
                        );

                    }
                );

            });
    }


    /* ==========================================
       MARK ATTENDANCE
    ========================================== */

    async function markAttendance(
        eventId,
        participantId,
        button
    ) {

        button.disabled = true;

        button.textContent =
            "Marking...";


        try {

            const response =
                await fetch(
                    `/api/events/${eventId}/participants/${participantId}/attendance`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            status: "Present"
                        })
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "Attendance update failed"
                );
            }


            await loadParticipants(eventId);

            await loadDashboardStats(eventId);


        } catch (error) {

            console.error(error);

            button.disabled = false;

            button.textContent =
                "Mark Present";

            alert(
                "Unable to mark attendance."
            );
        }
    }


    /* ==========================================
       DASHBOARD STATISTICS
    ========================================== */

    async function loadDashboardStats(eventId) {

        try {

            const response =
                await fetch(
                    `/api/events/${eventId}/dashboard`
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to load dashboard"
                );
            }

            const data =
                await response.json();


            totalRegistered.textContent =
                data.total_registered ?? 0;

            totalPresent.textContent =
                data.total_present ?? 0;

            totalAbsent.textContent =
                data.total_absent ?? 0;

            attendancePercentage.textContent =
                `${data.attendance_percentage ?? 0}%`;


        } catch (error) {

            console.error(error);

            totalRegistered.textContent =
                "0";

            totalPresent.textContent =
                "0";

            totalAbsent.textContent =
                "0";

            attendancePercentage.textContent =
                "0%";
        }
    }


    /* ==========================================
       PARTICIPANT SEARCH
    ========================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                if (!query) {

                    renderParticipants(
                        allParticipants
                    );

                    return;
                }


                const filtered =
                    allParticipants.filter(
                        participant => {

                            return (

                                participant.name
                                    .toLowerCase()
                                    .includes(query)

                                ||

                                participant.email
                                    .toLowerCase()
                                    .includes(query)

                                ||

                                participant.college_id
                                    .toLowerCase()
                                    .includes(query)

                            );

                        }
                    );


                renderParticipants(filtered);

            }
        );

    }


    /* ==========================================
       CREATE EVENT MODAL
    ========================================== */

    const createEventButton =
        document.querySelector(
            ".create-event-button"
        );


    if (createEventButton) {

        createEventButton.addEventListener(
            "click",
            () => {

                openCreateEventModal();

            }
        );

    }


    /* ==========================================
       OPEN MODAL
    ========================================== */

    function openCreateEventModal() {

        if (!createEventModal) {
            return;
        }

        createEventModal.classList.add("open");

        createEventModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        resetCreateEventForm();


        setTimeout(() => {

            document
                .getElementById("eventName")
                ?.focus();

        }, 100);

    }


    /* ==========================================
       CLOSE MODAL
    ========================================== */

    function closeCreateEvent() {

        if (!createEventModal) {
            return;
        }

        createEventModal.classList.remove(
            "open"
        );

        createEventModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

    }


    /* ==========================================
       CLOSE BUTTON
    ========================================== */

    if (closeCreateEventModal) {

        closeCreateEventModal.addEventListener(
            "click",
            closeCreateEvent
        );

    }


    /* ==========================================
       CANCEL BUTTON
    ========================================== */

    if (cancelCreateEvent) {

        cancelCreateEvent.addEventListener(
            "click",
            closeCreateEvent
        );

    }


    /* ==========================================
       CLICK OUTSIDE MODAL
    ========================================== */

    if (createEventModal) {

        createEventModal
            .querySelectorAll(
                "[data-close-modal]"
            )
            .forEach(element => {

                element.addEventListener(
                    "click",
                    closeCreateEvent
                );

            });

    }


    /* ==========================================
       ESCAPE KEY
    ========================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                createEventModal &&
                createEventModal.classList.contains("open")
            ) {

                closeCreateEvent();

            }

        }
    );


    /* ==========================================
       RESET FORM
    ========================================== */

    function resetCreateEventForm() {

        if (createEventForm) {
            createEventForm.reset();
        }

        hideCreateEventError();

        if (submitCreateEvent) {

            submitCreateEvent.disabled =
                false;

        }

        if (submitCreateEventText) {

            submitCreateEventText.hidden =
                false;

        }

        if (submitCreateEventLoader) {

            submitCreateEventLoader.hidden =
                true;

        }

    }


    /* ==========================================
       CREATE EVENT FORM SUBMIT
    ========================================== */

    if (createEventForm) {

        createEventForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                hideCreateEventError();


                const name =
                    document
                        .getElementById("eventName")
                        .value
                        .trim();


                const date =
                    document
                        .getElementById("eventDate")
                        .value;


                const description =
                    document
                        .getElementById(
                            "eventDescription"
                        )
                        .value
                        .trim();


                if (!name) {

                    showCreateEventError(
                        "Please enter an event name."
                    );

                    return;
                }


                if (!date) {

                    showCreateEventError(
                        "Please select an event date."
                    );

                    return;
                }


                await createEvent(
                    name,
                    date,
                    description
                );

            }
        );

    }


    /* ==========================================
       CREATE EVENT API
    ========================================== */

    async function createEvent(
        name,
        date,
        description
    ) {

        setCreateEventLoading(true);


        try {

            const response =
                await fetch(
                    "/api/events",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            date,
                            description
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                showCreateEventError(
                    data.error ||
                    "Unable to create event."
                );

                setCreateEventLoading(false);

                return;
            }


            closeCreateEvent();

            await loadEvents();


        } catch (error) {

            console.error(error);

            showCreateEventError(
                "Something went wrong while creating the event."
            );

        } finally {

            setCreateEventLoading(false);

        }
    }


    /* ==========================================
       MODAL LOADING STATE
    ========================================== */

    function setCreateEventLoading(
        loading
    ) {

        if (submitCreateEvent) {

            submitCreateEvent.disabled =
                loading;

        }

        if (submitCreateEventText) {

            submitCreateEventText.hidden =
                loading;

        }

        if (submitCreateEventLoader) {

            submitCreateEventLoader.hidden =
                !loading;

        }

    }


    /* ==========================================
       SHOW MODAL ERROR
    ========================================== */

    function showCreateEventError(
        message
    ) {

        if (!createEventError) {
            return;
        }

        createEventError.textContent =
            message;

        createEventError.hidden =
            false;

    }


    /* ==========================================
       HIDE MODAL ERROR
    ========================================== */

    function hideCreateEventError() {

        if (!createEventError) {
            return;
        }

        createEventError.textContent =
            "";

        createEventError.hidden =
            true;

    }


    /* ==========================================
       NAVIGATION
    ========================================== */

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".nav-item"
                        )
                        .forEach(nav => {

                            nav.classList.remove(
                                "active"
                            );

                        });


                    item.classList.add(
                        "active"
                    );


                    const text =
                        item.textContent
                            .trim()
                            .toLowerCase();


                    if (
                        text.includes(
                            "dashboard"
                        )
                    ) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }


                    if (
                        text.includes(
                            "events"
                        )
                    ) {

                        document
                            .querySelector(
                                ".dashboard-section"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                    }


                    if (
                        text.includes(
                            "participants"
                        ) ||
                        text.includes(
                            "attendance"
                        )
                    ) {

                        const sections =
                            document.querySelectorAll(
                                ".dashboard-section"
                            );

                        sections[1]
                            ?.scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                    }

                }
            );

        });


    /* ==========================================
       HELPERS
    ========================================== */

    function getInitials(name) {

        if (!name) {
            return "U";
        }

        return name
            .split(" ")
            .map(
                word =>
                    word.charAt(0)
            )
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }


    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* ==========================================
       START APPLICATION
    ========================================== */

    loadEvents();

});