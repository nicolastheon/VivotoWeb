<template>
  <v-container>

    <v-container v-show="connection === false">
      <v-text-field v-model="id" label="Id"></v-text-field>
      <v-text-field v-model="password" label="Password" ></v-text-field>
      <v-btn v-on:click="log">Connexion</v-btn>
      <v-btn v-on:click="newLog">New login</v-btn>
     </v-container>

  <v-container v-show="connection">
    <v-layout text-center wrap>
      <v-form v-model="valid">
        <v-container>
          <v-row>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="title"
                label="Title"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="content"
                label="Content"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-btn v-on:click="addTodo">Add</v-btn>
              <v-btn v-on:click="seen">Del</v-btn>
            </v-col>

            <v-col cols="12" md="4">
            <v-btn v-on:click="logout">Logout</v-btn>
          </v-col>

            <v-col cols="12" md="4">
              <ol>
                  <li v-for="(item, i) in todoList" :key="i">
                    {{ item.title }} : {{item.content}}
                    <v-btn v-show="seen_button" v-on:click="delTodo(i)">Del</v-btn>
                  </li>
              </ol>
            </v-col>
          </v-row>

        </v-container>
      </v-form>
    </v-layout>
  </v-container>

  </v-container>
</template>

<script>
export default {
  data: () => ({
    url: '',
    valid: false,
    title: '',
    content: '',
    seen_button: false,
    id: '',
    password: '',
    todoList: [{ title: '', content: '' }],
    connection: false
  }),
  methods: {
    async log () {
      const answer = await this.axios.post(this.url + '/api/log', {
        login: this.id,
        password: this.password
      })
      if (answer.data.message === 'connected') {
        this.connection = true
        this.todoList = answer.data.todoList
      }
      console.log(answer.data.message)
    },

    async newLog () {
      const answer = await this.axios.post(this.url + '/api/newLog', {
        login: this.id,
        password: this.password
      })
      console.log(answer.data.message)
    },

    async refreshTodo () {
      const answer = await this.axios.post(this.url + '/api/refreshTodo', {
        login: this.id,
        password: this.password,
        todoList: this.todoList
      })
      console.log(answer.data.message)
    },

    async logout () {
      await this.axios.post(this.url + '/api/logout', {
      })
      this.connection = false
    },

    addTodo () {
      this.todoList.push({
        title: this.title,
        content: this.content
      })
      this.seen_button = false
      this.refreshTodo()
    },

    delTodo (i) {
      this.todoList.splice(i, 1)
      this.seen_button = false
      this.refreshTodo()
    },

    seen () {
      this.seen_button = true
    }
  }
}
</script>
