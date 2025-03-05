document.addEventListener("DOMContentLoaded", () => {
    // Select the 'Get started' button
    const getStartedButton = document.querySelector('.main-content .text button');

    // Add click event listener to the button
    getStartedButton.addEventListener("click", () => {
        window.location.href = "../signup&login/sign-up.html";
    });
    const getStartedButtonbyid = document.querySelector('#connectButton');

    // Add click event listener to the button
    getStartedButtonbyid.addEventListener("click", () => {
        window.location.href = "../signup&login/sign-up.html";
    });
    
    const getStartednavButton = document.querySelector('#Login');

    // Add click event listener to the button
    getStartednavButton.addEventListener("click", () => {
        window.location.href = "../signup&login/login.html";
    });
});

