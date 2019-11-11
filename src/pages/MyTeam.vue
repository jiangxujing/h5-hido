<template>
    <!-- 我的团队 -->
    <div class="main-content my-team">
        <div v-for="(item, index) in myTeam" :key="index" class="team-item">
            <div class="team-first">
                <div class="team-first-photo">
                    <img :src="item.firstAgentPhoto" alt="" v-if="item.firstAgentPhoto">
                    <span v-else></span>
                </div>
                <h5>{{item.firstAgentPhone}}</h5>
                <h5>{{item.firstAgentAmount}}</h5>
            </div>
            <van-collapse v-model="item.activeNames">
                <van-collapse-item :name="idx" v-for="(child, idx) in item.list" :key="idx">
                    <div slot="title">
                        <!-- <div></div> -->
                        <span>二级代理</span>
                        <span>{{item.secondAgentNo + '人'}}</span>
                    </div>
                    <div>
                        <div v-for="(second, i) in item.list[0]" :key="i">
                            <span>{{second.secondAgentPhone}}</span>
                            <span>{{second.secondAgentAmount}}</span>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>

        <!-- <van-collapse v-model="activeNames">
            <van-collapse-item :name="index" v-for="(item, index) in myTeam" :key="index">
                <div slot="value">
                    <div>{{item.firstAgentPhone}}</div>
                    <div>{{item.firstAgentAmount}}</div>
                </div>
                <div>
                    <div v-for="(child, idx) in item.list" :key="idx">
                        <span>{{child.secondAgentPhone}}</span>
                        <span>{{child.secondAgentAmount}}</span>
                    </div>
                </div>
            </van-collapse-item>
        </van-collapse> -->
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
            activeNames: ['1'],
            pageNo: 0,
            pageSize: 10,
            total: 0,
            myTeam: []
        }
    },
    mounted () {
        document.title = '我的团队'
        this.getMyTeam()
    },
    computed: {

    },
    methods: {
        // 获取团队信息
        getMyTeam () {
            const content = [{
                firstAgentAmount: 500000,
                firstAgentPhone: '131****7810(小明)',
                firstAgentPhoto: '',
                secondAgentNo: 5,
                list: [{
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }]
            }, {
                firstAgentAmount: 300000,
                firstAgentPhone: '131****7810(小明)',
                firstAgentPhoto: '',
                secondAgentNo: 3,
                list: [{
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }]
            }]

            this.myTeam = content.map(item => {
                let itemObj = {
                    firstAgentPhone: item.firstAgentPhone,
                    firstAgentPhoto: item.firstAgentPhoto,
                    secondAgentNo: item.secondAgentNo,
                    firstAgentAmount: formatMoney(item.firstAgentAmount, 1),
                    activeNames: [],
                    list: []
                }
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
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/scss/vant.scss';
    .my-team {
        padding-top: 1rem;
        .team-item {
            background: #fff;
        }
        .team-first-photo {
            width: 3.1rem;
            height: 3.1rem;
            padding: 1.2rem 1rem 0 1.5rem;
        }
    }
</style>