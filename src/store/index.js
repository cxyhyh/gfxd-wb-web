import Vue from 'vue'
import vuex from 'vuex'
import tab from './tab'
import tagsView from '../js/common/tagViews'
Vue.use(vuex)
export default new vuex.Store({
    state:{},
    mutations:{},
    actions:{},
    modules:{
        tab,
        tagsView
        
    }
})
