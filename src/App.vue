<template>
  <v-app>
    <v-toolbar app>
      <!-- ログイン中のみサイドメニューを表示 v-show -->
      <v-toolbar-side-icon show="$store.state.login_user" @click.stop="toggleSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase;">
        <span>マイアドレス帳</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- ログインユーザーが存在する場合のみログアウトボタンを表示 -->
      <v-toolbar-items v-if="$store.state.login_user">
        <v-btn @click="logout">ログアウト</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <SideNav />

    <v-content>
      <!-- ルート毎に設定したコンポーネントが表示される -->
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
// メソッドをグローバルに使えるように
import { mapActions } from 'vuex';
import SideNav from './components/SideNav';

export default {
  name: 'App',
  components: {
    SideNav,
  },
  created () {
    // ログインユーザーの取得処理
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // ログインした場合は連絡先一覧のページに移動
        this.setLoginUser(user)
        // firebaseからアドレスのリストを取得
        this.fetchAddresses()
        // ユーザーがログインしてかつ、現在のページがhomeの画面だった場合、連絡先一覧に移動している
        if (this.$router.currentRoute.name === 'home') this.$router.push({ name: 'addresses'})
      } else {
        // ログアウト処理が完了するとonAuthStateChangedが呼ばれstoreからユーザーが削除される
        this.deleteLoginUser()
        // ログアウトした場合もhome画面に移動させる
        this.$router.push({ name: 'home' })
      }
    }) 
  },
  data() {
    return {
      //
    };
  },
  methods: {
    // 分割代入 使用したいメソッドを追加すると使える 
    ...mapActions(['toggleSideMenu', 'setLoginUser', 'logout', 'deleteLoginUser', 'fetchAddresses']),
  },
};
</script>
