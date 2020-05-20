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
    <div
      class="holder"
      id="holder"
      v-bind:style="{width: terminalWidth, height: terminalHeight}"
      v-show="terminalShow"
      v-bind:class="minimized ? 'minimize-animation' : ''"
    >
      <div class="header" @dblclick="maximizeHandler" id="draggable">
        <div class="width: 100%">
          <h4 onselectstart="return false" style="width: inherit">{{user}}</h4>
        </div>
        <div class="buttons">
          <button class="exit" @click="closeTerminal" @dblclick.stop="maximized = maximized">
            <div class="close-sign">x</div>
          </button>
          <button class="minimize" @click="minimizeTerminal" @dblclick.stop="maximized = maximized">
            <div class="line-min"></div>
          </button>
          <button class="maximize" @click="maximizeHandler" @dblclick.stop="maximized = maximized">
            <div class="square-max"></div>
          </button>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <!-- <div class="back"></div> -->
          <div onselectstart="return false" class="wrapper" id="history" v-html="history + cursor"></div>
        </div>
        <div
          class="copyright"
        >Copyright &copy; 2020 Tehran, Iran. All rights reserved for alirezaonline.xyz</div>
      </div>
    </div>
  </div>
</template>

<script>
import func from "./func";
export default {
  name: "App",
  components: {},
  data() {
    return {
      blink: false,
      user: "guest@alirezaonline.xyz:~$ ",
      cursor: "_",
      hint:
        '<div style="font-size: 14px; font-weight: 500;">(to see help, please use "-help" command)</div>',
      welcome: "Hi",
      history: "",
      response: "",
      input: "",
      cursorBlinking: null,
      typingInterval: null,
      command: "",
      directLevel: 0,
      directObject: { name: "", email: "", text: "" },
      scrollInterval: null,
      selected: 0,
      terminalShow: false,
      maximized: false,
      terminalWidth: "80%",
      terminalHeight: "500px",
      minimized: false,
      terminal: null,
      dimension: { initialXPosition: 0, initialYPosition: 0 }
    };
  },
  created() {},
  mounted() {},
  methods: {
    typing(str) {
      this.scrollDown();
      this.stopInputListening();
      let self = this;
      this.stopBlinking();
      str = str.split("");
      let i = 0;
      this.typingInterval = setInterval(() => {
        if (i < str.length) {
          self.history += str[i];
        } else {
          self.stopTyping();
        }
        i++;
      }, 20);
    },
    minimizeTerminal() {
      this.minimized = true;
      let self = this;
      setTimeout(() => {
        self.terminalShow = false;
      }, 200);
    },
    notMinimizeTerminal() {
      if (this.minimized) {
        this.minimized = false;
        this.terminalShow = true;
      }
    },
    openTerminal() {
      if (!this.terminalShow) {
        this.terminalShow = true;
        this.typing(this.welcome + "<br/>" + this.hint + "<br/>" + this.user);
        clearInterval(this.scrollInterval);
        this.startBlinking();
        this.drag();
      }
    },
    maximizeHandler() {
      let holder = document.querySelector("#holder");
      if (!this.maximized) {
        holder.style.left = "-8px";
        holder.style.top = "-10px";
        this.terminalWidth = document.body.clientWidth + "px";
        this.terminalHeight = "978px";
        this.maximized = true;
      } else {
        holder.style.left = "250px";
        holder.style.top = "40px";
        this.terminalWidth = "80%";
        this.terminalHeight = "500px";
        this.maximized = false;
      }
    },
    startBlinking() {
      let self = this;
      this.cursorBlinking = setInterval(() => {
        if (self.blink) {
          this.cursor = "";
          self.blink = false;
        } else {
          this.cursor = "_";
          self.blink = true;
        }
      }, 700);
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
          this.terminal.style.cursor = "default";
          this.headerTerminal.onmouseup = null;
        };
      });
    },
    closeTerminal() {
      this.terminalShow = false;
      this.command = "";
      this.history = "";
      this.minimized = false;
      this.maximized = false;
      document.body.onmouseup = () => {
        document.removeEventListener("mousemove", this.onMouseMove);
      };
    },
    moveAt(pageX, pageY) {
      this.terminal.style.cursor = "move";
      if (this.maximized) {
        this.maximizeHandler();
      }
      this.terminal.style.left = pageX - this.dimension.initialXPosition + "px";
      this.terminal.style.top = pageY - this.dimension.initialYPosition + "px";
    },
    onMouseMove(event) {
      this.moveAt(event.pageX, event.pageY);
    },
    stopBlinking() {
      clearInterval(this.cursorBlinking);
    },
    stopTyping() {
      try {
        clearInterval(this.typingInterval);
        clearInterval(this.scrollInterval);
      } catch (e) {
        console.log(e);
      }
      this.startInputListener();
    },
    startInputListener() {
      document.body.addEventListener("keydown", this.eventFunction);
    },
    scrollDown() {
      this.scrollInterval = setInterval(() => {
        let container = document.querySelector(".container");
        container.scrollBy(0, 10000);
      }, 20);
    },
    stopScrolling() {
      clearInterval(this.scrollInterval);
    },
    eventFunction() {
      this.stopBlinking();
      if (event.keyCode == 13) {
        if (this.command == "") {
          this.history += "<br/>" + this.user;
        } else if (this.command == "clear") {
          this.history = this.user;
        } else {
          this.typing(func.commandExecution(this.command));
        }
        this.command = "";
      } else if (event.keyCode == 8) {
        this.backSpace();
      } else if (event.key.length == 1) {
        this.command += event.key;
        this.history += event.key;
      }
      this.startBlinking();
    },
    stopInputListening() {
      document.body.removeEventListener("keydown", this.eventFunction);
    },
    backSpace() {
      if (this.command.length > 0) {
        this.command = this.command.substring(0, this.command.length - 1);
        this.history = this.history.substring(0, this.history.length - 1);
      }
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
