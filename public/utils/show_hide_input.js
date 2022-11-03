document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("hide_show_input-btn").addEventListener("click", () => {
        const input_box = document.getElementById("input");
        input_box.style.display = input_box.style.display == "none" ? "block" : "none";
    });
});
