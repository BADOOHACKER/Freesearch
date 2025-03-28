// Initialisation de IndexedDB
const dbRequest = indexedDB.open("OfflineSearchDB", 1);

dbRequest.onupgradeneeded = function (event) {
    const db = event.target.result;
    const store = db.createObjectStore("data", { keyPath: "id" });
    store.createIndex("content", "content", { unique: false });
};

dbRequest.onsuccess = function (event) {
    const db = event.target.result;
    const searchInput = document.getElementById("search");
    const resultsList = document.getElementById("results");

    // Ajout de données (uniquement pour l'exemple)
    const transaction = db.transaction("data", "readwrite");
    const store = transaction.objectStore("data");
    store.add({ id: 1, content: "Bonjour" });
    store.add({ id: 2, content: "Recherche hors ligne" });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        resultsList.innerHTML = "";

        const transaction = db.transaction("data", "readonly");
        const store = transaction.objectStore("data");
        const index = store.index("content");

        index.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.content.toLowerCase().includes(query)) {
                    const li = document.createElement("li");
                    li.textContent = cursor.value.content;
                    resultsList.appendChild(li);
                }
                cursor.continue();
            }
        };
    });
};
