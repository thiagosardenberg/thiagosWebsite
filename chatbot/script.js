async function sendMessage(){

    const prompt=document.getElementById("prompt").value;

    if(!prompt.trim()) return;

    addMessage(prompt,"user");

    document.getElementById("prompt").value="";

    const response=await fetch("/api/chat",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            message:prompt
        })

    });

    const data=await response.json();

    addMessage(data.reply,"bot");

}

document.getElementById("send").onclick=sendMessage;
document.getElementById("sendBtn").addEventListener("click", async () => {
    const input = document.getElementById("prompt");
    const output = document.getElementById("response");

    output.textContent = "Thinking...";

    try {
        const reply = await sendMessage(input.value);
        output.textContent = reply;
    } catch (err) {
        output.textContent = "Something went wrong.";
        console.error(err);
    }
});
const widget = document.getElementById("chat-widget");

document.getElementById("chat-toggle").onclick = () => {
    widget.classList.remove("hidden");
};

document.getElementById("close-chat").onclick = () => {
    widget.classList.add("hidden");
};

const messages = document.getElementById("messages");

function addMessage(text,type){

    const div=document.createElement("div");

    div.className=`message ${type}`;

    div.textContent=text;

    messages.appendChild(div);

    messages.scrollTop=messages.scrollHeight;

}