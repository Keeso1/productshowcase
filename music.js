class Musicbtn extends HTMLElement {
    constructor() {
        super();
        const musictemplate = document.createElement("template");
        musictemplate.innerHTML = `
        <style>
            :host{
                width: 3rem;
                height: 3rem;
                overflow: hidden;
            }
            
            audio {
                display: none;
            }

            .mute-btn{
                background: none;
                border: none;
                cursor: pointer;
                width: 100%;
                height: 100%;
                
            }

            .mute-btn:hover img {
                filter: brightness(0) invert(1);
                    
            }

            .mute-btn img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter:drop-shadow(1px 1px black);
            }
        </style>
        
        <audio controls="" preload="" loop="" muted="">
            <source src="/audio/technoloop.mp3" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <button class="mute-btn">
            <img src="/icons/mute.svg" alt="mute Button">
        </button>
        `
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(musictemplate.content.cloneNode(true));
    }
    connectedCallback() {
        const audio = this.shadowRoot.querySelector('audio');
        audio.volume = 0.1;
        const button = this.shadowRoot.querySelector('.mute-btn');
        const icon = button.querySelector('img');

        let context;
        console.log(audio);
        let source;
        let filter;


        button.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
            }

            if (!context) {
                context = new AudioContext();
                source = context.createMediaElementSource(audio);
                filter = context.createBiquadFilter();
                filter.type = "lowpass";
                filter.frequency.value = 20000;
                source.connect(filter);
                filter.connect(context.destination);
            }

            if (context.state === "suspended") {
                context.resume();
            }

            audio.muted = !audio.muted;

            console.log("muted: ", audio.muted);
            console.log("playing: ", !audio.paused);
            console.log(icon.src);

            if (audio.muted) {
                icon.src = "/icons/mute.svg";
                icon.alt = 'mute Button';
            } else {
                icon.src = "/icons/unmute.svg";
                icon.alt = 'Unmute Button';
            }
        });

        const snapContainer = document.querySelector(".snapcontainer");
        snapContainer.addEventListener("scroll", () => {
            if (filter) {
                const maxScroll = snapContainer.scrollHeight - snapContainer.clientHeight;
                const scrollPosition = snapContainer.scrollTop;
                const normalizedScroll = scrollPosition / maxScroll;
                const minFrequency = 200;
                const maxFrequency = 20000;
                const frequency = maxFrequency - normalizedScroll * (maxFrequency - minFrequency);
                filter.frequency.value = frequency;
            }
        });
    }
}
customElements.define('music-btn', Musicbtn);