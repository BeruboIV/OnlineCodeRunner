document.addEventListener("DOMContentLoaded", () => {
    const mode = document.getElementById("mode");
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    const hide_show_btn = document.getElementById("hide_show_input-btn");
    const terminalContainer = document.getElementById("terminal-container");

    mode.addEventListener("change", () => {
        const curr_mode = mode.options[mode.selectedIndex].text;
        if (curr_mode === "Interactive") {
            input.style.display = "none";
            hide_show_btn.disabled = true;
            terminalContainer.style.zIndex = "10";
            output.style.zIndex = "-10";
        } else if (curr_mode == "Non-Interactive") {
            input.style.display = "block";
            hide_show_btn.disabled = false;
            terminalContainer.style.zIndex = "-10";
            output.style.zIndex = "10";
        }
    });
});
