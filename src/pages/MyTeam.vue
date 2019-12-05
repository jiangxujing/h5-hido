<template>
    <!-- 我的团队 -->
    <div class="main-content my-team">
        <div v-if="request">
            <div v-if="myTeam && myTeam.length > 0">
                <div v-for="(item, index) in myTeam" :key="index" class="team-item">
                    <div class="team-first">
                        <img class="first-img" :src="item.firstAgentPhoto" v-if="item.firstAgentPhoto" />
                        <span class="first-img-bg" v-else></span>
                        <div class="first-content">
                            <div class="first-phone">{{item.firstAgentInfo}}</div>
                            <div class="first-amount">{{'￥' + item.firstAgentAllAmount}}</div>
                        </div>
                    </div>
                    <van-collapse v-model="activeNames">
                        <van-collapse-item :name="index + '-' + idx" v-for="(child, idx) in item.list" :key="idx" class="team-second">
                            <div slot="title" class="second-no">
                                <span>二级代理</span>
                                <span class="second-no-right fl-r">{{item.firstAgentTeamSum + '人'}}</span>
                            </div>
                            <div class="second-list" v-if="activeNames.indexOf(index + '-' + idx) > -1 && item.list[0].length > 0">
                                <div v-for="(second, i) in item.list[0]" :key="i" class="second-child">
                                    <img class="second-img" :src="second.secondAgentPhoto" v-if="second.secondAgentPhoto" />
                                    <span class="second-img-bg" v-else></span>
                                    <div class="second-content">
                                        <span class="second-phone">{{second.secondAgentPhone}}</span>
                                        <span class="second-amount fl-r">{{'￥' + second.secondAgentAmount}}</span>
                                    </div>
                                </div>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </div>
            </div>
            <div class="no-content" v-else>暂无团队</div>
        </div>
    </div>
</template>

<script>
import { Toast, Collapse, CollapseItem } from 'vant'
import api from '../common/api.js'
import { formatMoney } from '../common/utils.js'

export default {
    name: 'my-team',
    data () {
        return {
            activeNames: [],
            myTeam: [],
            request: false
        }
    },
    mounted () {
        document.title = '我的团队'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.callHandler('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getMyTeam()
            }, 600)
        } else {
            this.getMyTeam()
        }
    },
    methods: {
        // 获取团队信息
        getMyTeam () {
            api.post(api.getUrl('agent-queryMyteam'), {}).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content && res.content.length > 0) {
                        this.myTeam = res.content.map(item => {
                            let itemObj = {
                                firstAgentPhoto: item.firstAgentPhoto,
                                firstAgentTeamSum: item.firstAgentTeamSum,
                                firstAgentAllAmount: formatMoney(item.firstAgentAllAmount, 1),
                                activeNames: [],
                                list: []
                            }
                            itemObj.firstAgentInfo = item.firstAgentName ? item.firstAgentPhone + '(' + item.firstAgentName + ')' : item.firstAgentPhone
                            itemObj.list[0] = item.list.map(child => {
                                let childObj = {
                                    secondAgentPhone: child.secondAgentPhone,
                                    secondAgentPhoto: child.secondAgentPhoto,
                                    secondAgentAmount: formatMoney(child.secondAgentAmount, 1)
                                }
                                return childObj
                            })
                            return itemObj
                        })
                    } else {
                        this.myTeam = []
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>