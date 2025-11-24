// Sabor y Salud - Progress Tracker
// Uses localStorage to keep entries on this device

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tracker-form");
    const tableBody = document.querySelector("#tracker-table tbody");
    const clearButton = document.getElementById("clear-tracker");
    const noEntriesMessage = document.getElementById("no-entries-message");

    if (!form || !tableBody) {
        // Page does not have the tracker (other pages also load JS if you add script later)
        return;
    }

    const STORAGE_KEY = "sys-tracker-entries";

    function loadEntries() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            return JSON.parse(stored) || [];
        } catch (e) {
            console.error("Error parsing stored entries", e);
            return [];
        }
    }

    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function renderEntries() {
        const entries = loadEntries();
        tableBody.innerHTML = "";

        if (entries.length === 0) {
            if (noEntriesMessage) noEntriesMessage.style.display = "block";
            return;
        }

        if (noEntriesMessage) noEntriesMessage.style.display = "none";

        entries.forEach(function (entry) {
            const tr = document.createElement("tr");

            const dateCell = document.createElement("td");
            dateCell.textContent = entry.date || "";

            const moveCell = document.createElement("td");
            moveCell.textContent = entry.movement || "";

            const nutritionCell = document.createElement("td");
            nutritionCell.textContent = entry.nutrition || "";

            const moodCell = document.createElement("td");
            moodCell.textContent = entry.mood || "";

            const reflectionCell = document.createElement("td");
            reflectionCell.textContent = entry.reflection || "";

            tr.appendChild(dateCell);
            tr.appendChild(moveCell);
            tr.appendChild(nutritionCell);
            tr.appendChild(moodCell);
            tr.appendChild(reflectionCell);

            tableBody.appendChild(tr);
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const date = form.date.value;
        const movement = form.movement.value.trim();
        const nutrition = form.nutrition.value.trim();
        const mood = form.mood.value.trim();
        const reflection = form.reflection.value.trim();

        if (!date || !movement || !nutrition || !mood) {
            alert("Please fill in Date, Movement, Nutrition, and Mood/Energy.");
            return;
        }

        const entries = loadEntries();
        entries.unshift({
            date,
            movement,
            nutrition,
            mood,
            reflection
        });
        saveEntries(entries);
        renderEntries();

        form.reset();
    });

    clearButton.addEventListener("click", function () {
        const confirmClear = confirm("Clear all tracker entries on this device?");
        if (!confirmClear) return;
        localStorage.removeItem(STORAGE_KEY);
        renderEntries();
    });

    // Initial render
    renderEntries();
});