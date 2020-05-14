<template>
  <div
    class="holder"
    id="holder"
    v-bind:style="{width: terminalWidth, height: terminalHeight}"
    v-show="terminalShow"
    v-bind:class="minimized ? 'minimize-animation' : ''"
  >
    <div class="header" @dblclick="maximize" id="draggable">
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
        <button class="maximize" @click="maximize" @dblclick.stop="maximized = maximized">
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
</template>
<script>
export default {
  props: ["minimized, maximized"],
  name: "terminal",
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
      scrollInterval: null
    };
  },

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
    maximize() {
      this.$emit("maximize");
    },
    minimize() {
      this.$emit("minimize");
    },
    openTerminal() {
      this.typing(this.welcome + "<br/>" + this.hint + "<br/>" + this.user);
      clearInterval(this.scrollInterval);
      this.startBlinking();
    },
    closeTerminal() {
      this.command = "";
      this.history = "";
      this.$emit("close");
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
    }
  }
};
</script>
<style scoped>
</style>