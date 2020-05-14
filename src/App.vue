<template>
  <div id="app" class="bg">
    <div @click="selected = 0">
      <div class="trash" @click.stop="selected = 1">
        <div class="icon" v-bind:class="selected == 1 ? '' : ''"></div>
        <div class="caption" v-bind:class="selected == 1 ? 'selected-caption' : ''">
          <div>Trash</div>
        </div>
      </div>
      <div
        class="terminal"
        @dblclick="openTerminal"
        @click.stop="selected = 2"
        @click="notMinimizeTerminal"
      >
        <div class="icon" v-bind:class="selected == 2 ? '' : ''"></div>
        <span class="minimizeCircle" v-show="minimized"></span>
        <div class="caption" v-bind:class="selected == 2 ? 'selected-caption' : ''">
          <div>Terminal</div>
        </div>
      </div>
    </div>
    <Terminal
      class="holder"
      id="holder"
      :minimized="minimized"
      :maximized="maximized"
      v-bind:style="{width: terminalWidth, height: terminalHeight}"
      v-show="terminalShow"
      v-bind:class="minimized ? 'minimize-animation' : ''"
      ref="window"
    />
  </div>
</template>

<script>
import Terminal from "./components/terminal";
import func from "./func";
export default {
  name: "App",
  components: { Terminal },
  data() {
    return {
      selected: 0,
      terminalShow: false,
      maximized: false,
      minimized: false,
      terminalWidth: "80%",
      terminalHeight: "500px",
      terminal: null,
      dimension: { initialXPosition: 0, initialYPosition: 0 }
    };
  },
  created() {
    this.$on("maximize", this.maximizeHandler);
    this.$on("close", this.closeTerminal);
    this.$on("minimize", this.minimizeTerminal);
  },
  mounted() {},
  methods: {
    moveAt(pageX, pageY) {
      if (this.maximized) {
        this.maximizeHandler();
      }
      this.terminal.style.left = pageX - this.dimension.initialXPosition + "px";
      this.terminal.style.top = pageY - this.dimension.initialYPosition + "px";
    },
    onMouseMove(event) {
      this.moveAt(event.pageX, event.pageY);
    },

    openTerminal() {
      if (!this.terminalShow) {
        this.terminalShow = true;
        this.$refs.window.openTerminal();
        this.drag();
      }
    },

    drag() {
      this.headerTerminal = document.getElementById("draggable");
      this.terminal = document.getElementById("holder");
      this.headerTerminal.addEventListener("mousedown", event => {
        this.dimension.initialXPosition =
          event.clientX - this.terminal.getBoundingClientRect().left;
        this.dimension.initialYPosition =
          event.clientY - this.terminal.getBoundingClientRect().top;
        document.addEventListener("mousemove", this.onMouseMove);
        document.body.onmouseup = () => {
          document.removeEventListener("mousemove", this.onMouseMove);
          this.headerTerminal.onmouseup = null;
        };
      });
    },
    closeTerminal() {
      this.terminalShow = false;
      this.$refs.window.closeTerminal();
      this.minimized = false;
      this.maximized = false;
      document.body.onmouseup = () => {
        document.removeEventListener("mousemove", this.onMouseMove);
      };
    },
    moveAt(pageX, pageY) {
      if (this.maximized) {
        this.maximizeHandler();
      }
      this.terminal.style.left = pageX - this.dimension.initialXPosition + "px";
      this.terminal.style.top = pageY - this.dimension.initialYPosition + "px";
    },
    onMouseMove(event) {
      this.moveAt(event.pageX, event.pageY);
    }
  },
  destroyed() {
    this.stopBlinking();
    clearInterval(this.typingInterval);
  }
};
</script>

<style>
body {
  background: url("./assets/back.jpg") center center fixed no-repeat;
  object-fit: fill;
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  background-size: cover;
  overflow: hidden;
  z-index: 1;
}

.holder {
  margin-top: -20px;
  position: absolute;
  top: 0;
  left: 250px;
  height: 500px;
  transition: 50ms;
}

#app {
  font-family: Ubuntu, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #8adf32;
  margin-top: 20px;
}

.container {
  width: 100%;
  height: inherit;
  background-color: #2d0922;
  position: absolute;
  overflow-y: auto;
  box-shadow: 2px 2px 20px 5px rgba(0, 0, 0, 0.5);
}

.header {
  background: linear-gradient(
    180deg,
    rgba(86, 84, 76, 1) 0%,
    rgba(71, 69, 64, 1) 35%,
    rgba(62, 61, 57, 1) 100%
  );
  height: 32px;
  color: white;
  text-align: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

h4 {
  width: inherit;
  padding-top: 2px;
}

.row {
  margin: -15px;
  padding: -15px;
  width: 100%;
  text-align: center;
}

.wrapper {
  /* display: inline-block; */
  /* background-color: white; */
  width: 60%;
  /* height: 100px; */
  text-align: left;
  font-size: 18px;
  font-weight: 520;
  line-height: 30px;
  margin-left: 20px;
  margin-top: 10px;
}
.input {
  display: inline-block;
}

.table {
  /* border-color: rgb(21, 204, 21); */
  border-color: #8adf32;
  border-style: dashed;
}

td {
  font-weight: 400;
  padding: 20px;
  text-align: left;
  border-style: dashed;
}

a {
  text-decoration: none;
  color: #b6b6b6;
}

a:hover {
  text-decoration: underline;
}

.back {
  position: absolute;
  background: url("./assets/peng.png") center center no-repeat;
  object-fit: fill;
  width: 100%;
  height: 100%;
  /* background-size: 600px 600px; */
  right: 0;
  top: 0;
  z-index: 0;
  opacity: 0.1;
}

.copyright {
  font-size: 13px;
  font-weight: 100px;
  position: fixed;
  right: 12px;
  bottom: 6px;
  color: white;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.7);
}

@media (max-width: 992px) {
  .back {
    background-size: 500px 500px;
  }

  .copyright {
    position: fixed;
    bottom: -10px;
    right: -388px;
    /* left: 0;*/
    transform-origin: 0 0;
    transform: rotate(-90deg);
  }
}

.buttons {
  position: absolute;
  margin-left: 5px;
  top: 20px;
}

.buttons > button {
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: inline-block;
  text-align: center;
  margin-left: 3px;
  /* outline: 1px solid #3d3c37; */
  border: 1px solid #3d3c37;
}

.exit {
  background-color: #e8673c;
  line-height: 17px;
  color: #3d3c37;
}

.close-sign {
  position: absolute;
  margin-left: -4px;
  margin-top: -9px;
}

.exit:hover {
  background-color: rgb(224, 122, 88);
}

.minimize,
.maximize {
  background-color: #7a7972;
}

.minimize:hover,
.maximize:hover {
  background-color: silver;
}

.square-max {
  position: absolute;
  width: 8px;
  height: 6px;
  border: 1.5px solid #3d3c37;
  margin-left: -5px;
  margin-top: -3px;
}

.line-min {
  position: absolute;
  width: 10px;
  height: 1px;
  margin-left: -5px;
  margin-top: 1px;
  background-color: #3d3c37;
}

.trash,
.terminal {
  width: 50px;
  text-align: center;
  margin: 20px;
}

.terminal {
  width: 80px;
}

.trash {
  margin-left: 35px;
}

.trash > .icon {
  background: url("./assets/trash.png") center center no-repeat;
  width: 50px;
  height: 50px;
  background-size: 50px 50px;
  /* background-color: rgba(224, 122, 88, 0.7); */
}

.caption {
  padding: 2px;
  color: silver;
  font-weight: 400;
  margin-top: 7px;
  font-size: 16px;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}

.terminal > .icon {
  background: url("./assets/terminal.png") center center no-repeat;
  width: 80px;
  height: 50px;
  background-size: 50px 50px;
  /* background-color: rgba(224, 122, 88, 0.7); */
}

.selected-icon {
  opacity: 0.7;
}

.selected-caption {
  background-color: rgba(224, 122, 88, 0.7);
  border-radius: 5px;
}

.minimize-animation {
  transform: translateX(-100%);
  transform: scaleY(0);
  transition: 0.2s;
  /* width: 0px; */
}
.minimizeCircle {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-color: rgb(224, 122, 88);
  left: 110px;
  top: 140px;
}
</style>
