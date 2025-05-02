<template>
<div id="app">
  <n-modal v-model:show="showModal" :mask-closable="false">
    <n-card style="width: 500px" title="Sign in" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <template #header-extra></template>
      <div style="padding:5px "><input ref="account" required v-model="user.UserID" @blur="user.UserID = user.UserID.toLowerCase();" type="text" placeholder="Account" autofocus />
        <select v-model="user.Domain" style="display:none">
          <option selected>shinymark</option>
          <option>superbpowerinc</option>
          <option>ptpeihai</option>
          <option>ptraychain</option>
        </select>
      </div>
      <div style="padding:5px"><input ref="password" required v-model="user.password" type="password" placeholder="Password" /></div>
      <template #footer>
        <div style="text-align: center;">
          <el-button @click="login()" :loading="isLoading">Login</el-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</div>
</template>

<script lang="ts"> // Vue3 中沒有 setup 的寫法如下，最後必須將宣告的函數或方法逐一 return
import { ref, defineComponent, reactive, onMounted, inject } from 'vue';
import { NModal, NButton, NCard } from 'naive-ui'
import { useRoute } from 'vue-router'
import CryptoJS from 'crypto-js';
import router from '@/router'
import { useAccountStore } from '@/stores/store'
import commonFunction from '@/composables/commonFunction'

// const account = useAccountStore()
const { $ASPNET_SALT } = commonFunction()

export default defineComponent({
  name: 'login',
  components: {
    NModal, NButton, NCard
  },
  setup() {
    const showModal = ref(false)
    const route = useRoute()
    const user = reactive({ UserID: '', Domain: 'shinymark', password: '' })
    const reload = inject<Function>("reload")! // 注意，在使用 inject 函數時，需要使用泛型指定注入的屬性類型。如果注入的屬性不存在，inject 函數將返回 undefined。我們可以使用 ! 操作符來告訴 TypeScript，我們已經確定注入的屬性一定存在。
    const isLoading = ref(false)

    const login = async () => {
      isLoading.value = true; // 原先 this.isLoading = true 改為 isLoading.value = true
      let param = {
        UserID: user.UserID.toLowerCase(),
        password: btoa(user.password),
        Domain: user.Domain
      };
      try {
        await useAccountStore().login(param)
        window.$message.success('Login Successfully!')
        let url = route.query.redirect ? decodeURIComponent(route.query.redirect as string) : '/';
        route.params.object === 'vue' ? router.replace({ path: url }) : window.close();
      } catch (error) {
        isLoading.value = false;
        console.log(error)
        window.$message.error('帳號錯誤或密碼錯誤!')
      }
    }
    const logout = (Mode: number) => {
      useAccountStore().logout()
        .then(() => {
          window.$message.success('Logout Successfully!')
          if (Mode == 0) {
            window.close()
          } else {
            router.replace({ name: "Form_login", params: { object: 'vue' } }).then(() => { reload() })
          }
        })
        .catch((err) => {
          console.log(err)
          window.$message.error('Logout Failed!')
        });
    }
    const DotNet_Login = () => {
      try {
        let encrypted = atob(decodeURIComponent(route.params.object as string));
        var decrypted = CryptoJS.AES.decrypt(encrypted, $ASPNET_SALT);
        let obj = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

        user.UserID = obj.UserID;
        user.password = obj.password;
        login();

      } catch (err) {
        logout(0);
      }
    }
    onMounted(() => {
      switch (route.params.object) {
        case 'vue':
          showModal.value = true
          break;
        case 'asp.net':
          logout(0);
          break;
        case 'logout':
          logout(1);
          break;
        default:
          DotNet_Login();
          break;
      }
    })

    return {
      user,
      login,
      logout,
      showModal,
      isLoading
    }
  }
})

</script>


<style scoped>
input {
  width: 100%;
  height: 28px;
  border: 1px solid rgba(60, 60, 60, .26);
  padding: 4px 4px;
  border-spacing: 2px;
  border-radius: 3px;
}

select {
  width: 30%;
  height: 28px;
  border: 1px solid rgba(60, 60, 60, .26);
  padding: 4px 4px;
  border-spacing: 2px;
  border-radius: 3px;
}

.login {
  width: 400px;
  height: auto;
  border: 1px solid rgba(60, 60, 60, .26);
  padding: 10px;
}

div button {
  height: 30px;
  padding: 0px 25px;
  border: 1px solid rgba(60, 60, 60, .26);
}
</style>