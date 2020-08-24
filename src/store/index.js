import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'  //Firebaseをインポート

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    // アドレスを追加する配列を用意
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    // ログアウト
    deleteLoginUser (state) {
      state.login_user = null
    },
    // サイドメニューの開閉
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    // actionsの第2引数でコンポーネントから値を受け取ることが出来る
    addAddress (state, { id, address }) {
      // アドレスにidが含まれたままstoreに格納される
      address.id = id
      // addressesの配列に追加する
      state.addresses.push(address)
    },
    updateAddress (state, { id, address }) {
      // findIndexメソッドによって対象のアドレスオブジェクトが存在するインデックスを調べている
      const index = state.addresses.findIndex(address => address.id === id)
      // 調べたインデックスの位置に新しいアドレスオブジェクトを代入して更新
      state.addresses[index] = address
    },
    deleteAddress (state, { id }) {
      const index = state.addresses.findIndex(address => address.id === id)
      state.addresses.splice(index, 1)
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    // firebaseからデータを取得する
    fetchAddresses ({ getters, commit }) {
      /* 
      保存時と同じようにパスを指定する
      getメソッドを呼び出すと非同期でデータの取得が実行されてthenメソッドに渡した関数の引数でgetの結果を受け取れる
      snapshot変数にaddressのデータが格納されているのでforEachで1つ1つアドレスのリストに追加している
      snapshotは配列ではなく、クエリースナップショットというオブジェクトになっていて純粋な配列とは異なる。
      docオブジェクトはdata()メソッドによって取り出している
      */
      firebase.firestore().collection(`users/${getters.uid}/addresses`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAddress', { id: doc.id, address: doc.data() }))
      })
    },
    login () {
      // google認証のプロバイダーを利用する際に必要
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      // signInWithRedirectが呼ばれたタイミングでgoogleの認証画面にリダイレクトされる
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    // firebaseのログアウトを呼び出すaction  Authenticationの機能でログアウト出来る
    logout() {
      firebase.auth().signOut()
    },
    deleteLoginUser({
      commit
    }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ getters, commit }, address) {
      // gettersからuidを取得できたら、firestoreのcollectionメソッドでデータベース上のパスを指定してaddメソッドで連絡先のオブジェクトを追加している
      if (getters.uid) {
        /*
         addメソッドのコールバック関数にはドキュメントリファレンシーズのオブジェクトが渡ってくる。
         渡ってきたオブジェクトをdoc変数で受け取っている。そのdoc変数にidが含まれているので
         idを取り出してstoreに渡している。
         */
        firebase.firestore().collection(`users/${getters.uid}/addresses`).add(address).then(doc => {
          // commitの第2引数でデータを渡す必要があるのでオブジェクトの形式で渡している
          commit('addAddress', { id: doc.id, address })
        })
      }
    },
    // データを更新するアクション
    updateAddress ({ getters, commit }, { id, address }) {
      if (getters.uid) {
        /*
        docメソッドにidを渡して更新対象を取得してから、updateメソッドで更新している
        更新が完了すればstateも更新される
        */
        firebase.firestore().collection(`users/${getters.uid}/addresses`).doc(id).update(address).then(() => {
          commit('updateAddress', { id, address})
        })
      }
    },
    // 削除対象のidを受け取ってdeleteメソッドで削除。削除が完了するとコールバック関数が呼ばれる
    deleteAddress ({ getters, commit }, { id }) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).doc(id).delete().then(() => {
          commit('deleteAddress', { id })
        })
      }
    }
  },
  getters: {
    /*
    getters関数には自動的にstateが渡ってくる
    stateからデータを取得して加工したデータを返す
    三項演算しでstateにログインユーザーが存在する場合にはdisplayNameを返して,
    存在しなければ空文字を返すという処理になっている。
    */
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    // ユーザーIDの取得
    uid: state => state.login_user ? state.login_user.uid : null,
    // 対象の連絡先を取得してformに反映する
    /* 関数を返す関数場合は内側の関数が返ってくる。この場合はfind
    idを引数に受け取ってstoreのアドレス情報からidがマッチするものを返す関数
    このような関数を定義することでgetterを呼び出す時点でidを指定してidにマッチするものを習得する
    */ 
    getAddressById: state => id => state.addresses.find(address => address.id === id)
  },
  modules: {
  }
})