<template>
  <div>
    <div class="text-center hero">
      <img class="mb-3 app-logo" src="/logo.png" alt="Vue.js logo">
      <h1 class="mb-4">Rurdy</h1>
      <p class="lead">
        SPA van Ruben Mampaey &amp; Jordy Janssens.
      </p>
      <div v-if="this.$auth.isAuthenticated()" id="apiresponse">
            <button class="btn btn-primary btn-block" @click="callApi">Get API data</button>
                  
      </div>
    </div>
        <div v-if="apiMessage" align="center">
      <h2>Result</h2>
      <p>{{ apiMessage }}</p>
    </div>
    <div align="center">
    <iframe sandbox="allow-scripts" src='https://trypap.com/' style="border: 2; width:1000px; height:750px;"></iframe>
    </div>
    <hr>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      apiMessage: null
    };
  },
  methods: {
    async callApi() {
      const accessToken = await this.$auth.getAccessToken();

      try {
        const { data } = await axios({
  method:'get',
  url:'https://rudyapi.azurewebsites.net/api/private-scoped',
  headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        this.apiMessage = data.message;
      } catch (e) {
        this.apiMessage = `Error: the server responded with '${ e.response.status }: ${e.response.statusText}'`; }
    }
  }
};
</script>
<style lang="scss" scoped>
.next-steps {
  .fa-link {
    margin-right: 5px;
  }
}
</style>
