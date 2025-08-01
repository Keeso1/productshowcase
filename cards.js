class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.card_component_template = document.createElement("template");
    this.card_component_template.innerHTML = `
<style>
    * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
 

.card {
    z-index: 1;
    font-size:2px;
    position: relative;
    min-height: 350em;
    display: grid;
    justify-content: center;
    grid-template-columns: auto 210em auto auto;
    grid-template-rows: auto auto auto auto;
    column-gap: 16em;
    font-family: 'Rajdhani';
    overflow: hidden;
    background-image: url("images/rectangle-113-6.svg");
    background-repeat:no-repeat;
    border-right: 4em solid rgba(94, 246, 255, 0.5);
    width:0%;
    transition: 0.5s ease-in;
    animation:flicker 0.1s infinite;
    scroll-snap-align: center;
    scroll-snap-stop:always;
}

.card.reveal{
    width:538.5em;
    clip-path:inset(0);
}

.cardheader{
    grid-row-start:2;
    grid-column-start: 2;
    grid-row-end: 2;
    grid-column-end: 2;
    font-size: 24em;
    font-weight:bold;
    text-align: left;
    color: rgba(94, 246, 255, 1);
    text-shadow: 1px 1px 10px rgba(94, 246, 255, 0.9);
  
}
  
  
.cardparagraph {
    grid-row-start:3;
    grid-column-start: 2;
    grid-row-end: 3;
    grid-column-end: 2;
    font-size: 12em;
    font-weight: bold;
    text-align: left;
    text-shadow: 1px 1px 10px rgba(94, 246, 255, 0.9);
    color: rgba(94, 246, 255, 1);
    
}
  
.cardimage {
    grid-row-start:3;
    grid-column-start: 3;
    grid-row-end: 3;
    grid-column-end: 3;
    border: 0.5em solid rgba(94, 246, 255, 1);
    border-radius: 10em;
    width: 185em;
    height: 175em;
    filter:drop-shadow(0 0 3px rgba(94, 246, 255, 1));
}
  
  .scaled {
    transform: scale(1.1); 
    
}
  @keyframes flicker {
    0%, 100% {
        border-color: rgba(94, 246, 255, 0.5); 
    }
    50% {
        border-color: rgba(94, 246, 255, 1);
    }
    25%, 75% {
        border-color: rgba(94, 246, 255, 0.0); 
    }
}
    


</style>
    <div class="card">
    </div>
      `
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(this.card_component_template.content.cloneNode(true));
    this.card = this.shadowRoot.querySelector('.card');
  }

  connectedCallback() {

    let cardHeader = this.querySelector('h1');
    let cardParagraph = this.querySelector('p');
    let cardImage = this.querySelector('img');

    cardHeader.classList.add("cardheader");
    cardParagraph.classList.add("cardparagraph");
    cardImage.classList.add("cardimage");

    this.card.appendChild(cardHeader);
    this.card.appendChild(cardParagraph);
    this.card.appendChild(cardImage);

    const wrapper = document.querySelector('.cards-wrapper')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {

        if (entry.isIntersecting) {

          setTimeout(() => {
            this.card.classList.add('reveal');
          }, 1500);

          setTimeout(() => {
            this.card.style.borderRight = "none"
            this.card.style.animation = "none";
          }, 2050);
          observer.unobserve(wrapper);
        }
      })
    })

    const slider = document.querySelector(".slider");

    const scaleSlider = () => {
      slider.classList.add("scaled");
    }
    const scaleCard = () => {
      this.card.classList.add("scaled");
    };

    const resetCard = () => {
      this.card.classList.remove("scaled");
    };

    let isScrolling;

    slider.addEventListener("scroll", () => {
      scaleSlider();
      scaleCard();

      clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        resetCard();
      }, 200);
    });

    observer.observe(wrapper);
  }
}


customElements.define('card-component', MyComponent);
