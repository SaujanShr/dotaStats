
var xhr = new XMLHttpRequest();

function requestUpdate()
{
    console.log("Sending update request...");
    xhr.open("GET", "http://localhost:3000/update", true);
    xhr.send();
    console.log("Request sent successfully.");
}