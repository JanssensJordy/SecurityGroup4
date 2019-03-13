<template>
  <div>
    <div class="text-center hero">
      <img class="mb-3 app-logo" src="/logo.png" alt="Vue.js logo">
      <h1 class="mb-4">Rurdy</h1>
      <p class="lead">
        SPA van Ruben Mampaey &amp; Jordy Janssens.
      </p>
      <div v-if="this.$auth.isAuthenticated()" id="apiresponse">
            <button class="btn btn-primary btn-block" @click="getProtectedApiData">Get API data</button>
                  
      </div>
    </div>
    <div align="center">
    <iframe sandbox="allow-scripts" src='https://trypap.com/' style="border: 2; width:1000px; height:750px;"></iframe>
    </div>
    <hr>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  name: "home",
  methods: {
      getProtectedApiData(){
     var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://janssens.eu.auth0.com/oauth/token",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
      },
      "data": "{\"client_id\":\"Fjx1E2D0OChNsVvenII79Lc5BQ30Aiu8\",\"client_secret\":\"oCqZMiP-Ub2tKY0UpDq11_rBA7tEmRs1ttFWYSxmsW0nY5HTlcUTrC3qu2kRjqx0\",\"audience\":\"naamapi\",\"scope\":\"rudy.read\",\"grant_type\":\"client_credentials\"}"
    }
    $.ajax(settings).done(function (token) { 
                           var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://rudyapi.azurewebsites.net/api/private-scoped",
  "method": "GET",
  "headers": {
    "authorization": "Bearer " +  token.access_token //eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTFRemcyUkVKQ00wTXpNRVJFTXpkRk16ZEZSVEE0TXpKRVFUTTJORGhDTVRGRk1UTkJSUSJ9.eyJpc3MiOiJodHRwczovL2phbnNzZW5zLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJGangxRTJEME9DaE5zVnZlbklJNzlMYzVCUTMwQWl1OEBjbGllbnRzIiwiYXVkIjoibmFhbWFwaSIsImlhdCI6MTU1MTg5MDg5OCwiZXhwIjoxNTUxOTc3Mjk4LCJhenAiOiJGangxRTJEME9DaE5zVnZlbklJNzlMYzVCUTMwQWl1OCIsInNjb3BlIjoicnVkeS5yZWFkIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.fMJLhi2a-v4AZXFkWSKJETVYLtsa4D0eLAkXnddgM3zJS5J09YzrNraWEGhlmSKwx8JlfskndhPYI3YCD2kYXL8AKGxRJdi6YuAcmN_1MxaM9BjjZaFXgxe8dHsllUNCZsLDnEcrDTujBnyklUMJcarFgfDOIAsniLZTZyjANF1GxvJDcUqbZZxfwbKBIfZ5t30hrHQEf5sRbNCKq_0MvX0pJke3sNl5ihShqukJ5ZSk_WQfA0LGIMXzCdvTu5FIMFCWdBxgreJHqTbKfolK8JNOdMnjRWTrMSyfKie-tH7mbm2u2vsubOU1TUC0R6N-hb7BoqXRLdjSFJGz1TBCEQ"
  }
}
$.ajax(settings).done(function (response) {
  console.log(response);
  var sHtml = '<p class="lead">Antwoord: ' + response.message + '</p>'
  $("#apiresponse").html(sHtml);
});
    });
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
