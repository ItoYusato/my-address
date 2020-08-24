<template>
  <v-navigation-drawer v-model="$store.state.drawer" absolute temporary>
    <v-list class="pa-1">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <!-- ログイン中なら写真がサイドナビに表示される -->
          <img v-if="photoURL" :src="photoURL"/>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <!-- ログイン中ならユーザー名がサイドナビに表示される -->
          <v-list-tile-title>{{ userName }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile v-for="item in items" :key="item.title" :to="item.link">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'  
export default {
  data() {
    return {
      items: [
        { title: "連絡先一覧", icon: "list", link: { name: "addresses" } },
        { title: "今日やること", icon: "face" },
      ],
    };
  },
  computed: {
    /*
    getterのメソッドがcomputedに組み込まれる
    computedに組み込むことによってそのコンポーネントの１つのプロパティとして
    getterの戻り値を参照できる
    */
    ...mapGetters(['userName', 'photoURL'])
  }
};
</script>
