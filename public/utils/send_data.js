/*
 * Before sending the POST request, the data from div must be passed to textarea
 * so that it can be accessed in backend
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        document.getElementById("code").value = document.getElementsByClassName("ace_content").item(0).innerText;
        form.submit();
    });
});
