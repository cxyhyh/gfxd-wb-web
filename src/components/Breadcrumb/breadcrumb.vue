<template>
    <div class="tags-box">
        <div class="tags" v-for="item in pathList" :key="item.path" :class="{ 'active': item.path === $route.path }"
            @click="tabsHandle($event, item.path)" @contextmenu.prevent.stop="rightClick($event, item.path)">
            <div>{{ item.name }}</div>
            <i class="el-icon-close"></i>
            <ul v-show="otherFlag && (path === item.path)">
                <li>关闭其他</li>
            </ul>
        </div>
    </div>
</template>
 
<script>
export default {
    data() {
        return {
            pathList: [],
            otherFlag: false,
            path: '',
        }
    },
    created() {
        this.checkPathList(this.$route.path, this.$route.name, this.$route.title)
    },
    methods: {
        tabsHandle(e, path) {
            if (e.target.nodeName === 'DIV') {
                this.$router.push(path)
            } else if (e.target.nodeName === 'I') {
                let index = this.pathList.findIndex(item => item.path == path)
                if (this.pathList.length <= 1) return
                this.pathList.splice(index, 1)
                if (this.$route.path === path) {
                    if (index === 0) {
                        this.$router.push(this.pathList[this.pathList.length - 1])
                    } else {
                        this.$router.push(this.pathList[index - 1])
                    }
                }
            } else {
                this.pathList = this.pathList.filter(item => item.path === path)
                this.otherFlag = false
                this.$router.push(path)
            }
        },
        rightClick(e, path) {
            if (e.target.nodeName === 'DIV') {
                this.otherFlag = true
                this.path = path
            }
        },
        checkPathList(path, name, title) {
            if ((this.pathList.findIndex(item => item.path == path)) === -1) {
                if (this.pathList.length >= 10) {
                    this.pathList.shift();
                }
                this.pathList.push({
                    path,
                    name,
                    title
                })
            }
        }
    },
    watch: {
        '$route': function (n) {
            this.checkPathList(n.path, n.name, n.title)
        },
        'otherFlag': function (n) {
            let clickFn = () => this.otherFlag = false
            if (n) {
                document.documentElement.addEventListener('click', clickFn)
            } else {
                document.documentElement.removeEventListener('click', clickFn)
            }
        }
    }
}
</script>
 
<style scoped >
.tags-box {
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    position: sticky;
    margin: 10px;
}

.tags {
    border-radius: 3px;
    font-size: 12px;
    height: 25px;
    background: #fff;
    border: 1px solid #e9eaec;
    padding: 0px 10px;
    margin-left: 7px;
    display: flex;
    align-items: center;
}

.tags:not(.active):hover {
    background: #f8f8f8;
}

.active {
    color: #fff;
    background: #409EFF;
}
</style>