<template>
  <v-container text-xs-center justify-center>
    <v-layout row wrap>
      <v-flex xs12>
        <h1>マイアドレス帳</h1>
        <p></p>
        <p>マイアドレス帳をご利用の方は、Googleアカウントでログインして下さい。</p>
      </v-flex>

      <v-flex xs12 mt-5>
        <v-btn color="info" @click="login">Googleアカウントでログイン</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['login'])
  }
};
</script>

<style scoped lang="stylus">
  .v-btn {
    text-transform: none;
  }
</style>