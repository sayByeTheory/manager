// 管理员主页面组件
const ManagerMainTemplate = `
<div>
    <el-container style="position:absolute; left:0; top:0; width:100%;height:100%;">
        <el-header style="height: 50px;padding-top: 5px;background-color: #3d4e63;">
            <div v-html="titleHtml" style="display: inline"></div>
            <el-dropdown @command="handleProfileCommand" trigger="click" style="cursor: pointer;position: absolute;right: 30px;margin-top: 8px;line-height: 30px">
                <span style="color: #fff">{{ manager.name }}<i class="el-icon-caret-bottom el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="showManagerProfile">我的信息</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside :style="{'overflow-x': 'hidden', width: sidebarCollapsed ? '65px' : '200px', transition: sidebarCollapsed ? 'width 0.3s' : 'width 0.45s'}">
                <el-menu :collapse="sidebarCollapsed"
                         :default-active="activeMenuItem"
                         router
                         class="manager-main-sidebar-menu"
                         background-color="#304156"
                         text-color="#bfcbd9"
                         active-text-color="#409EFF">
                    <el-menu-item v-for="route in allRoutes" v-if="!route.meta.hidden" :index="route.path" :key="route.path">
                        <i :class="route.meta.icon"></i>
                        <span slot="title">{{ route.meta.title }}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header height="50px" style="padding: 0px 10px; border-bottom: solid 1px rgb(230, 230, 230)">
                    <div style="float: left;line-height: 58px;">
                        <svg @click="sidebarCollapsed = !sidebarCollapsed" p-id="1691" t="1492500959545" :style="{display: 'inline-block',cursor: 'pointer',width: '20px',height: '20px',transform: sidebarCollapsed ? 'rotate(90deg)' : 'rotate(0deg)',transition: '.38s','transform-origin': '50% 50%'}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <path p-id="1692" d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"></path>
                            <path p-id="1693" d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"></path>
                            <path p-id="1694" d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"></path>
                        </svg>
                    </div>
                    <el-breadcrumb style="display: inline-block;margin-left: 20px;line-height: 50px;">
                        <el-breadcrumb-item v-for="item in breadcrumbItems" :to="{ path: item.path }" :key="item.path">{{ item.title }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</div>
`;

const ManagerMain = {
    template: ManagerMainTemplate,
    props: ['titleHtml', 'routes', 'targetName', 'findTarget', 'queryMatchedTargets'],
    router: new VueRouter({routes: []}),
    data: function () {
        return {
            allRoutes: this.routes,
            sidebarCollapsed: false,
            manager: {}
        };
    },
    computed: {
        activeMenuItem: function () {
            if (this.$route.matched.length > 0) {
                return this.$route.matched[0].path;
            }
            return '';
        },
        breadcrumbItems: function () {
            let parts = [];
            this.$route.path.split('/').forEach(function (part) {
                if (part) {
                    parts.push(part);
                }
            });

            let items = [];
            this.$route.matched.forEach(function (routeRecord) {
                if (routeRecord.path.endsWith('/')) {
                    return;
                }
                let partSize = 0;
                routeRecord.path.split('/').forEach(function (part) {
                    if (part) {
                        partSize++;
                    }
                });
                let path = '';
                for (let i = 0; i < partSize; i++) {
                    path += '/' + parts[i];
                }
                items.push({
                    title: routeRecord.meta.title,
                    path: path
                });
            });
            return items;
        }
    },
    created: function () {
        // 添加管理员相关组件
        this.allRoutes.push({
            path: '/managerManagers',
            component: ManagerManagers,
            meta: {
                title: '管理员',
                icon: 'manager-iconfont manager-icon-team'
            }
        }, {
            path: '/managerRelations',
            component: ManagerRelations,
            props: {
                targetName: this.targetName,
                findTarget: this.findTarget,
                queryMatchedTargets: this.queryMatchedTargets
            },
            meta: {
                title: '权限',
                icon: 'el-icon-view'
            }
        }, {
            path: '/managerProfile',
            component: ManagerProfile,
            meta: {
                hidden: true,
                title: '我的信息'
            }
        });
        this.$router.addRoutes(this.allRoutes);

        const theThis = this;
        // 获取当前管理员
        axios.get(MANAGER_ROOT_PATH + '/manager/main/current')
            .then(function (result) {
                if (!result.success) {
                    Vue.prototype.$message.error(result.message);
                    return;
                }
                if (result.manager === null) {
                    // 未登录，则跳转到登录页面
                    Vue.prototype.$alert('未登录或登录已超时，请进行登录', '警告', {
                        callback: function () {
                            window.location.href = MANAGER_LOGIN_PATH;
                        }
                    });
                    return;
                }
                theThis.manager = Object.assign({}, theThis.manager, result.manager);
            });
        // 检查路径
        if (this.$route.matched.length <= 0) {
            for (let i = 0; i < this.allRoutes.length; i++) {
                let routeRecord = this.allRoutes[i];
                if (!routeRecord.meta.hidden) {
                    this.$router.push(routeRecord.path);
                    break;
                }
            }
        }
    },
    methods: {
        handleProfileCommand: function (command) {
            switch (command) {
                case 'showManagerProfile':
                    this.showManagerProfile();
                    break;
                case 'logout':
                    this.logout();
                    break;
            }
        },
        showManagerProfile: function () {
            this.$router.push('/managerProfile');
        },
        logout: function () {
            axios.get(MANAGER_ROOT_PATH + '/manager/main/logout')
                .then(function (result) {
                    if (!result.success) {
                        Vue.prototype.$message.error(result.message);
                        return;
                    }
                    window.location.href = MANAGER_LOGIN_PATH;
                });
        }
    }
};