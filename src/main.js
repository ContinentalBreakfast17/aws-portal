import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store/index'
import api from './api/index'

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

Vue.use(AmplifyPlugin, AmplifyModules)

// this _can't_ be best practice
api.$store = store
Vue.use(api)

Vue.config.productionTip = false

Amplify.configure({
	Auth: {

		// REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
		//identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
		
		// REQUIRED - Amazon Cognito Region
		region: 'us-east-2',

		// OPTIONAL - Amazon Cognito Federated Identity Pool Region 
		// Required only if it's different from Amazon Cognito Region
		//identityPoolRegion: 'XX-XXXX-X',

		// OPTIONAL - Amazon Cognito User Pool ID
		userPoolId: 'us-east-2_uJ1DWumvk',

		// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
		userPoolWebClientId: '59o91ktt6k5evqtkrpbvf1es95',

		// OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
		mandatorySignIn: true,

		// // OPTIONAL - Configuration for cookie storage
		// // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
		// cookieStorage: {
		// // REQUIRED - Cookie domain (only required if cookieStorage is provided)
		// 	domain: '.yeezyfan.club',
		// // OPTIONAL - Cookie path
		// 	path: '/',
		// // OPTIONAL - Cookie expiration in days
		// 	expires: 365,
		// // OPTIONAL - Cookie secure flag
		// // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
		// 	secure: true
		// },

		// // OPTIONAL - customized storage object
		// storage: new MyStorage(),
		
		// OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
		//authenticationFlowType: 'USER_PASSWORD_AUTH'
	}
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
