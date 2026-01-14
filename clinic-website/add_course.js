document.getElementById("courseForm").addEventListener("submit", e => {
    e.preventDefault();

    const title = titleInput();
    if (!title) return;

    alert("Course published successfully ✅");
    e.target.reset();
});

function titleInput() {
    const title = document.getElementById("title").value.trim();
    if (!title) {
        alert("Course title is required");
        return null;
    }
    return title;
}
