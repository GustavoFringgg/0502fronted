import { acceptHMRUpdate, defineStore } from "pinia"
import axios from "axios"
import { RouteRecordName } from "vue-router"


export const useAccountStore = defineStore({
	id: "account",
	state: () => ({
		status: "",
		token: localStorage.getItem("access_token") || "",
		user: localStorage.getItem("user") || "",
		expires: localStorage.getItem("expires") || "",
		roles: {},
	}),
	actions: {
		async login(user: { UserID: string; password: string; Domain: string }) {
			try {
        this.status = "loading"
        let param = { param: btoa(JSON.stringify(user)) }
				const response = await axios.post(`/api/login`, user)
				if (response.data) {
          this.status = "success"
					this.token = response.data.access_token
					this.user = response.data.UserID
					this.expires = response.data.expires_in
					localStorage.setItem("access_token", this.token)
					localStorage.setItem("user", this.user)
					localStorage.setItem("expires", this.expires)
				} else {
					throw response
				}
			} catch (error) {
				this.status = "error"
				localStorage.removeItem("access_token")
				localStorage.removeItem("user")
				localStorage.removeItem("expires")
				throw error
			}
		},
		async logout() {
      this.status = ""
			this.token = ""
			localStorage.removeItem("access_token")
			axios.defaults.headers.common["authorization"] = ""
		},
	},
	getters: {
		isLoggedIn: state => state.token !== "",
		isExpires: (state) => (Date.parse(new Date().toString()) / 1000) > parseInt(state.expires, 10),
		authStatus: state => state.status,
		isUser: state => state.user,
		getToken: state => state.token,
	},
})

export const useGroupsStore = defineStore({
  id: 'get-groups',
  state: () => ({
    status: '',
    IsGroups: false,
    UserID: '',
    Groups: [],
    SharePG_Program: '',
    Program_Tag: '',
    Superior: '',
    Superior_Email: ''
  }),
  actions: {
    async getGroup(obj: { Program_Name: RouteRecordName | null | undefined; ProgramID: unknown }) {
      this.status = 'loading'
      try {
        const response = await axios.post(`/api/permission/IsGroups`, obj)
        if (response.data) {
          this.status = 'success'
          this.IsGroups = response.data.IsGroups
          this.UserID = response.data.UserID
          this.Groups = response.data.Groups
          this.SharePG_Program = response.data.SharePG_Program
          this.Program_Tag = response.data.Program_Tag
          this.Superior = response.data.Superior
          this.Superior_Email = response.data.Superior_Email
          if ((localStorage.getItem('user') || '') !== response.data.UserID) {
            localStorage.setItem('user', response.data.UserID)
          }
          return response.data
        } else {
          throw response.data
        }
      } catch (error) {
        this.status = 'error'
        this.IsGroups = false
        this.UserID = ''
        this.Groups = []
        this.SharePG_Program = ''
        this.Program_Tag = ''
        this.Superior = ''
        this.Superior_Email = ''
        throw error
      }
    }
  },
  getters: {
    getSharePG_Program: state => state.SharePG_Program,
    getIsGroups: state => state.IsGroups,
    getGroups: state => state.Groups,
    getProgram_Tag: state => state.Program_Tag,
    getUserID: state => state.UserID,
    getSuperior: state => state.Superior,
    getSuperior_Email: state => state.Superior_Email
  }
})

if (import.meta.hot) { // 啟動 HMR (Hot Module Replacement) 
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
  import.meta.hot.accept(acceptHMRUpdate(useGroupsStore, import.meta.hot));
} 