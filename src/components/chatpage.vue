<template>
  <div class="chat-container">
    <div v-if="!isUserLoggedIn" class="login-container">
      <label for="username" class="sr-only">Enter your username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your username..."
      />
      <button
        @click="createUser"
        class="inline-flex justify-center p-2 mt-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
      >
        Connect
      </button>
    </div>
    <div v-else class="chat-box">
      <div class="pt-12 pb-32">
        <div class="messages-container">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="{ 'flex-row-reverse': message.user.id === userId }"
            class="flex items-start gap-2.5"
          >
            <div
              :class="{
                'bg-blue-500 text-white rounded-tl-xl rounded-br-xl mb-4':
                  message.user.id === userId,
                'bg-gray-100 text-gray-900 rounded-e-xl mb-4':
                  message.user.id !== userId,
              }"
              class="flex flex-col gap-1 w-full max-w-[320px] p-4 rounded-es-xl"
            >
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <span class="text-lg font-semibold">
                  {{ message.user.username }}
                </span>
                <span
                  :class="{
                    'bg-blue-500 text-white': message.user.id === userId,
                  }"
                  class="text-sm font-normal"
                >
                  {{ new Date(message.createdAt).toLocaleString() }}
                </span>
              </div>
              <template v-if="isEditing === message.id">
                <textarea
                  v-model="editedMessage"
                  rows="1"
                  class="block w-full p-2.5 mt-2 text-sm bg-white border border-gray-300 rounded-lg text-black focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
                <button
                  @click="editMessage(message.id)"
                  class="inline-flex justify-center p-2 mt-2 text-black bg-white rounded-lg cursor-pointer hover:bg-green-400 dark:text-green-500 dark:hover:bg-gray-600"
                >
                  Modifier
                </button>
              </template>
              <p
                class="text-md font-normal"
                v-html="formatMessageContent(message.content)"
              ></p>
            </div>
            <template v-if="message.user.id === userId">
              <button
                @click="toggleDropdown(message.id)"
                class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                type="button"
              >
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 4 15"
                >
                  <path
                    d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                  />
                </svg>
              </button>
              <div
                v-if="isDropdownOpen === message.id"
                class="rounded-lg shadow w-40"
              >
                <ul
                  class="text-sm text-gray-700"
                  aria-labelledby="dropdownMenuIconButton"
                >
                  <li>
                    <a
                      href="#"
                      @click.prevent="
                        deleteMessage(message.id), toggleDropdown(message.id)
                      "
                      class="block px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-400 hover:rounded-lg"
                    >
                      Delete
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      @click.prevent="
                        (isEditing = message.id), toggleDropdown(message.id)
                      "
                      class="mt-2 block px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-400 hover:rounded-lg"
                    >
                      Edit
                    </a>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="fixed bg-white inset-x-0 bottom-0 w-full pb-6">
        <form @submit.prevent="sendMessage">
          <label for="chat" class="sr-only">Your message</label>
          <div class="flex items-center px-3 py-2 rounded-lg">
            <textarea
              id="chat"
              v-model="newMessage"
              rows="1"
              @keydown="handleKeyDown"
              class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your message..."
            ></textarea>
            <button
              type="submit"
              class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
            >
              <svg
                class="w-5 h-5 rotate-90 rtl:-rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path
                  d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"
                />
              </svg>
              <span class="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      userId: null,
      newMessage: "",
      messages: [],
      isUserLoggedIn: false,
      isDropdownOpen: null,
      isEditing: null,
      editedMessage: "",
      pollingInterval: null,
    };
  },
  methods: {
    toggleDropdown(messageId) {
      if (this.isDropdownOpen === messageId) {
        this.isDropdownOpen = null;
      } else {
        this.isDropdownOpen = messageId;
        const message = this.messages.find((msg) => msg.id === messageId);
        this.editedMessage = message.content;
      }
    },
    async editMessage(messageId) {
      try {
        await axios.put(`http://192.168.1.150:2200/edit-message/${messageId}`, {
          content: this.editedMessage,
          userId: this.userId,
        });
        this.isEditing = null;
        this.editedMessage = "";
        this.fetchMessages();
      } catch (error) {
        console.error("Error editing message:", error);
      }
    },
    async createUser() {
      if (username !== "zizi" || username !== "fdp" || username !== "merde"){
      try {
        const response = await axios.post("http://192.168.1.150:2200/create-user", {
          username: this.username,
        });
        this.userId = response.data.userId;
        this.isUserLoggedIn = true;
        this.startPolling();
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }else{
    console.log("utilisateur non accepter")
  }
  },
    async sendMessage() {
      try {
        if (!this.newMessage.trim()) {
          return;
        }

        await axios.post("http://192.168.1.150:2200/create-message", {
          content: this.newMessage,
          userId: this.userId,
        });

        this.newMessage = "";

        this.fetchMessages();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    async fetchMessages() {
      try {
        const response = await axios.get("http://192.168.1.150:2200/messages");
        this.messages = response.data;
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    handleKeyDown(event) {
      if (event.key === "Enter") {
        if (event.shiftKey) {
          const start = event.target.selectionStart;
          const end = event.target.selectionEnd;
          this.newMessage =
            this.newMessage.substring(0, start) +
            "\n" +
            this.newMessage.substring(end);
          this.$nextTick(() => {
            event.target.selectionStart = event.target.selectionEnd = start + 1;
          });
        } else {
          event.preventDefault();
          this.sendMessage();
        }
      }
    },
    formatMessageContent(content) {
      return content.replace(/\n/g, "<br>");
    },
    async deleteMessage(messageId) {
      try {
        await axios.delete(`http://192.168.1.150:2200/delete-message/${messageId}`);
        this.fetchMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
    startPolling() {
      this.pollingInterval = setInterval(this.fetchMessages, 5000);
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },
  },
  mounted() {
    this.fetchMessages();
    if (this.isUserLoggedIn) {
      this.startPolling();
    }
  },
  beforeDestroy() {
    this.stopPolling();
  },
};
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.login-container {
  margin: auto;
  width: 50%;
}
.chat-box {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}
.flex-row-reverse {
  flex-direction: row-reverse;
}
</style>
