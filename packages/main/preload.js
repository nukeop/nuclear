// TODO remove this when updating electron
window.ELECTRON_ENABLE_SECURITY_WARNINGS=false;
window.ELECTRON_DISABLE_SECURITY_WARNINGS=true;

const template = document.createElement('template');
template.innerHTML = `
<style>
  @keyframes gradient-anim {
    0%, 100% {
      background-position: 50% 50%;
    }
    25% {
      background-position: 0% 100%;
    }
    75% {
      background-position: 100% 0%;
    }
  }

  @keyframes loader-anim {
    0%, 100% {
      border-top: 4rem solid #FAFAFA;
    }
    50% {
      border-top: 4rem solid transparent;
    }
  }

  :host {
    position: absolute;
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: -1;
  }

  :host>div {
    position: relative;
    display: flex;
    flex-flow: column;
    background: linear-gradient(45deg, #43CBFF 0%, #9708CC 100%);
    background-size: 200% 200%;
    width: 15rem;
    height: 15rem;
    border-radius: 2rem;
    box-shadow: 0 0 38px rgba(0,0,0,0.30), 0 0 12px rgba(0,0,0,0.22);
    animation: gradient-anim 2s ease-in-out infinite;
  }

  :host>div>span {
    position: absolute;
    width: 0;
    height: 0;
    border-top: 4rem solid #FAFAFA;
    border-left: 3rem solid transparent;
    border-right: 3rem solid transparent;
  }

  :host>div>span:nth-child(1) {
    right: 4.5rem;
    top: 3.5rem;
  }

  :host>div>span:nth-child(2) {
    right: 7.5rem;
    bottom: 3.5rem;
  }

  :host>div>span:nth-child(3) {
    left: 7.5rem;
    bottom: 3.5rem;
  }
</style>
<div>
  <span></span>
  <span></span>
  <span></span>
</div>`;

class NuclearLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }      
}

window.customElements.define('nuclear-loader', NuclearLoader);
